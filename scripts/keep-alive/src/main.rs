use chrono::Local;
use colored::*;
use log::{error, info, warn};
use pretty_env_logger;
use serde::{Deserialize, Serialize};
use std::env;
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

#[derive(Serialize)]
struct CreateSignatureRequest {
    save: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    env::set_var("RUST_LOG", "info");
    pretty_env_logger::init();

    loop {
        let now = Local::now();
        info!(
            "Keeping {} alive on {}",
            "Particles on Canvas".bright_blue(),
            now.format("%B %-d, %Y, %H:%M")
        );

        let start_time = Instant::now();
        let status = reqwest::get(format!("{}/heartbeat", SERVICE_URL))
            .await?
            .status();
        let elapsed_time = start_time.elapsed();

        match status {
            reqwest::StatusCode::NO_CONTENT => {
                info!(
                    "Heartbeat {} at {} ({} ms)",
                    "received".green(),
                    now.format("%H:%M:%S"),
                    elapsed_time.as_millis()
                );
            }
            _ => {
                warn!(
                    "Heartbeat {} at {} ({} ms)",
                    "failed".red(),
                    now.format("%H:%M:%S"),
                    elapsed_time.as_millis()
                );
            }
        }

        create_signatures_request().await;
        tokio::time::sleep(tokio::time::Duration::from_secs(KEEP_ALIVE_SECONDS_TIMEOUT)).await;
    }
}

async fn create_signatures_request() {
    let url = format!("{}/signatures/create", SERVICE_URL);
    let body = CreateSignatureRequest { save: false };
    let client = reqwest::Client::new();

    let start_time = Instant::now();

    match client.post(&url).json(&body).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.json::<Signatures>().await {
                    Ok(_signatures) => {
                        let now = Local::now();
                        info!(
                            "Signatures {} at {} ({} ms)",
                            "received".green(),
                            now.format("%H:%M:%S"),
                            start_time.elapsed().as_millis()
                        );
                    }
                    Err(err) => {
                        let now = Local::now();
                        warn!(
                            "{} signatures at {} ({} ms), error: {:?}",
                            "Failed to create".red(),
                            now.format("%H:%M:%S"),
                            start_time.elapsed().as_millis(),
                            err
                        );
                    }
                }
            } else {
                error!(
                    "{} after {} ms with status code: {}",
                    "Request failed".red(),
                    start_time.elapsed().as_millis(),
                    response.status()
                );
            }
        }
        Err(err) => {
            error!(
                "{} while sending request after {} ms: {:?}",
                "An error occurred".red(),
                start_time.elapsed().as_millis(),
                err
            );
        }
    }
}
