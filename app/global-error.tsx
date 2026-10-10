"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="bn">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "sans-serif", background: "#f6f3ee", color: "#114236" }}>
        <main style={{ maxWidth: "28rem", padding: "2rem" }}>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>কিছু একটা ভুল হয়েছে</h1>
          <p style={{ marginTop: "0.75rem", lineHeight: 1.6 }}>পাতাটি এখন খোলা যায়নি। আবার চেষ্টা করুন।</p>
          <button type="button" onClick={() => reset()} style={{ marginTop: "1.5rem", border: 0, borderRadius: "999px", background: "#b42318", color: "#fff", padding: "0.75rem 1.25rem", font: "inherit" }}>
            আবার চেষ্টা
          </button>
        </main>
      </body>
    </html>
  );
}
