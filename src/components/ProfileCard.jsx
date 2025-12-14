import React from "react";

export default function ProfileCard() {
  return (
    <div style={{ marginLeft: 320, marginTop: 40 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <img
          src="/profile-photo.jpg"
          alt="Profile"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            objectFit: "cover",
            marginRight: 24,
            border: "1px solid #eee",
          }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            John Doe
          </h1>
          <div style={{ color: "#555", fontSize: 18 }}>Filmmaker</div>
        </div>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          padding: 24,
          marginBottom: 24,
          maxWidth: 800,
        }}
      >
        <h2
          style={{
            color: "#155c37",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Biography
        </h2>
        <p style={{ margin: 0 }}>
          I am an independent filmmaker specializing in short narrative films and
          creative storytelling. Her work focuses on youth, identity, and modern
          culture. She has submitted to festivals across Asia and continues to
          explore new cinematic styles.
        </p>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          padding: 24,
          maxWidth: 800,
        }}
      >
        <div style={{ fontSize: 17, lineHeight: "2" }}>
          <div>
            <b>Gmail:</b> Johndoe@gmail.com.kh
          </div>
          <div>
            <b>Country:</b> Viet nam
          </div>
          <div>
            <b>Contact:</b> +855 464929
          </div>
          <div>
            <b>Social:</b> www.JohnPorfolio.com
          </div>
        </div>
      </div>
    </div>
  );
}