import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ipSalt = process.env.IP_SALT || "change-moi-en-production";
const adminCode = process.env.ADMIN_CODE || "station-admin";

function getIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const real = req.headers["x-real-ip"];

  const ip = forwarded
    ? forwarded.split(",")[0].trim()
    : real || req.socket?.remoteAddress || "unknown";

  return ip;
}

function hashIp(ip) {
  return crypto
    .createHash("sha256")
    .update(`${ip}:${ipSalt}`)
    .digest("hex");
}

function bad(res, code, message) {
  return res.status(code).json({
    ok: false,
    message
  });
}

export default async function handler(req, res) {

  if (!supabaseUrl || !supabaseServiceKey) {
    return bad(res, 500, "Supabase non configuré.");
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseServiceKey
  );

  /*
  =====================
  VOTE UTILISATEUR
  =====================
  */
  if (req.method === "POST") {

    try {

      const body = req.body || {};

      const username = String(
        body.username || ""
      )
      .trim()
      .slice(0, 40);

      const votes = body.votes || {};

      if (!username || username.length < 2) {
        return bad(
          res,
          400,
          "Pseudo obligatoire."
        );
      }

      if (
        !votes ||
        typeof votes !== "object" ||
        Array.isArray(votes)
      ) {
        return bad(
          res,
          400,
          "Votes invalides."
        );
      }

      const ipHash = hashIp(
        getIp(req)
      );

      const { data: existingIp } =
        await supabase
          .from("submissions")
          .select("id")
          .eq("ip_hash", ipHash)
          .limit(1);

      if (
        existingIp &&
        existingIp.length > 0
      ) {
        return bad(
          res,
          409,
          "Un vote existe déjà depuis cette connexion."
        );
      }

      const { data: existingUser } =
        await supabase
          .from("submissions")
          .select("id")
          .ilike("username", username)
          .limit(1);

      if (
        existingUser &&
        existingUser.length > 0
      ) {
        return bad(
          res,
          409,
          "Ce pseudo a déjà voté."
        );
      }

      const cleanedVotes = {};

      for (const [cat, nominee] of Object.entries(votes)) {

        const key = String(cat)
          .trim()
          .slice(0, 60);

        const value = String(nominee)
          .trim()
          .slice(0, 60);

        if (key && value) {
          cleanedVotes[key] = value;
        }

      }

      if (
        Object.keys(cleanedVotes).length < 1
      ) {
        return bad(
          res,
          400,
          "Aucun vote."
        );
      }

      const { error } =
        await supabase
          .from("submissions")
          .insert({
            username,
            ip_hash: ipHash,
            votes: cleanedVotes
          });

      if (error) {
        return bad(
          res,
          500,
          error.message
        );
      }

      return res.status(200).json({
        ok: true
      });

    } catch {

      return bad(
        res,
        500,
        "Erreur serveur."
      );

    }

  }

  /*
  =====================
  RESULTATS PUBLICS
  =====================
  */
  if (
    req.method === "GET" &&
    req.query.public === "results"
  ) {

    const { data, error } =
      await supabase
        .from("submissions")
        .select("votes");

    if (error) {
      return bad(
        res,
        500,
        error.message
      );
    }

    const scores = {};

    for (const row of data || []) {

      for (const [cat, nominee] of Object.entries(row.votes || {})) {

        if (!scores[cat]) {
          scores[cat] = {};
        }

        if (!scores[cat][nominee]) {
          scores[cat][nominee] = 0;
        }

        scores[cat][nominee]++;

      }

    }

    const results = [];

    for (const [category, nominees] of Object.entries(scores)) {

      const top3 =
        Object.entries(nominees)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name, votes]) => ({
            name,
            votes
          }));

      results.push({
        name: category,
        top3
      });

    }

    return res.status(200).json(
      results
    );

  }

  /*
  =====================
  PANEL ADMIN
  =====================
  */
  if (req.method === "GET") {

    const code = req.query.code;

    if (code !== adminCode) {
      return bad(
        res,
        401,
        "Code admin invalide."
      );
    }

    const { data, error } =
      await supabase
        .from("submissions")
        .select("username, votes, created_at")
        .order(
          "created_at",
          {
            ascending: false
          }
        );

    if (error) {
      return bad(
        res,
        500,
        error.message
      );
    }

    const results = {};

    for (const row of data || []) {

      for (const [cat, nominee] of Object.entries(row.votes || {})) {

        results[cat] ||= {};
        results[cat][nominee] ||= 0;

        results[cat][nominee]++;

      }

    }

    return res.status(200).json({

      ok: true,

      total: data?.length || 0,

      results,

      submissions: data || []

    });

  }

  return bad(
    res,
    405,
    "Méthode non autorisée."
  );

}
