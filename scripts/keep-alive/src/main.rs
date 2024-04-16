use serde::{Deserialize, Serialize};
use std::time::Instant;

const SERVICE_URL: &str = "https://particles-on-canvas.onrender.com";

const KEEP_ALIVE_SECONDS_TIMEOUT: u64 = 60 * 3; // 3 minutes

#[derive(Debug, Deserialize, Serialize)]
struct Signatures {
    #[serde(rename = "combinedVelocity")]
    combined_velocity: u64,
    #[serde(rename = "layerDimensions")]
    layer_dimensions: Vec<u16>,
    strategy: String,
    signatures: Vec<Signature>,
}

#[derive(Debug, Deserialize, Serialize)]
struct Signature {
    image: String,
    seed: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    loop {
        let mut now = chrono::Local::now();
        println!(
            "Keeping \x1b[34mParticles on Canvas\x1b[0m alive on {}\x1b[0m",
            now.format("%B %-d, %Y, %H:%M").to_string()
        );

        let mut start_time = Instant::now();
        let mut status = reqwest::get(format!("{}/heartbeat", SERVICE_URL))
            .await?
            .status();
        let mut elapsed_time = start_time.elapsed();
        now = chrono::Local::now();

        if status == reqwest::StatusCode::NO_CONTENT {
            println!(
                // add green print
                "Heartbeat received at {} ({} ms)\n",
                now.format("%H:%M:%S").to_string(),
                elapsed_time.as_millis()
            );
        } else {
            println!(
                // add red print
                "Heartbeat failed at {} ({} ms)\n",
                now.format("%H:%M:%S").to_string(),
                elapsed_time.as_millis()
            );
        }

        start_time = Instant::now();
        create_signatures_request();
        elapsed_time = start_time.elapsed();
        // if ok, then log ok

        tokio::time::sleep(tokio::time::Duration::from_secs(KEEP_ALIVE_SECONDS_TIMEOUT)).await;
    }
}

async fn create_signatures_request() {
    let url = format!("{}/signatures/create", SERVICE_URL);
    match reqwest::Client::new().post(&url).send().await {
        Ok(response) => {
            if response.status().is_success() {
                let signatures = response.json::<Signatures>().await;
                println!("Signatures received successfully: {:?}", signatures);
            } else {
                println!("Request failed with status code: {}", response.status());
            }
        }
        Err(err) => {
            println!("Error occurred while sending request: {:?}", err);
        }
    }
}
