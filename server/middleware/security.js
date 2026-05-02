const SENSITIVE_FIELDS = new Set(["password", "token", "jwt", "secret"]);

function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function sanitizeInput(value, parentKey = "") {
    if (typeof value === "string") {
        if (SENSITIVE_FIELDS.has(parentKey.toLowerCase())) {
            return value;
        }

        return escapeHtml(value.trim());
    }

    if (Array.isArray(value)) {
        return value.map((item) => sanitizeInput(item, parentKey));
    }

    if (value && typeof value === "object") {
        const sanitized = {};
        for (const [key, nestedValue] of Object.entries(value)) {
            sanitized[key] = sanitizeInput(nestedValue, key);
        }
        return sanitized;
    }

    return value;
}

function sanitizeRequestBody(req, res, next) {
    if (req.body && typeof req.body === "object") {
        req.body = sanitizeInput(req.body);
    }

    if (req.query && typeof req.query === "object") {
        req.query = sanitizeInput(req.query);
    }

    next();
}

function setSecurityHeaders(req, res, next) {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; frame-ancestors 'none'; base-uri 'self'"
    );

    next();
}

module.exports = {
    sanitizeRequestBody,
    setSecurityHeaders
};
