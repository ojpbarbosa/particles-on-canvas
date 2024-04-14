use std::time::Instant;

const SERVICE_URL: &str = "https://particles-on-canvas.onrender.com";

const KEEP_ALIVE_SECONDS_TIMEOUT: u64 = 60 * 3; // 3 minutes

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    loop {
        let mut now = chrono::Local::now();
        println!(
            "Keeping \x1b[34mParticles on Canvas\x1b[0m alive on {}\x1b[0m",
            now.format("%B %-d, %Y, %H:%M").to_string()
        );

        let start_time = Instant::now();
        let status = reqwest::get(format!("{}/heartbeat", SERVICE_URL))
            .await?
            .status();
        let elapsed_time = start_time.elapsed();
        now = chrono::Local::now();

        if status == reqwest::StatusCode::NO_CONTENT {
            println!(
                "Heartbeat received at {} ({} ms)\n",
                now.format("%H:%M:%S").to_string(),
                elapsed_time.as_millis()
            );
        } else {
            println!(
                "Heartbeat failed at {} ({} ms)\n",
                now.format("%H:%M:%S").to_string(),
                elapsed_time.as_millis()
            );
        }

        tokio::time::sleep(tokio::time::Duration::from_secs(KEEP_ALIVE_SECONDS_TIMEOUT)).await;
    }
}
