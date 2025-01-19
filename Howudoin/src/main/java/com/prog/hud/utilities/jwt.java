package com.prog.hud.utilities;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import com.prog.hud.Types.userinfo;


import java.util.Date;

public class jwt {

    private static final String SECRET_KEY = "elameth23534dfhfgdjettrtgjjdrhftjfghdgrhftjfghdrgydh"; // Replace with your secure key
    private static final long EXPIRATION_TIME = 3600_000; // 1 hour in milliseconds

    // Generate JWT token using userinfo object
    public static String generateToken(userinfo user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("password", user.getPassword()).signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Validate the token and extract claims
    public static Claims validateToken(String token) {
        try {
            // Parse the token and retrieve the claims
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
            return claims;
        } catch (JwtException e) {
            // Token is invalid
            return null;
        }
    }
    // Convert Claims to userinfo object
    public static userinfo claimsToUserinfo(Claims claims) {
        if (claims == null) return null;

        // Extract fields from claims
        String username = claims.getSubject(); // "sub" claim
        String password = claims.get("password", String.class);

        // Create a new userinfo object
        userinfo user = new userinfo(username, ""); // Password should not be stored in the token
        user.password = password;

        return user;
    }
}

