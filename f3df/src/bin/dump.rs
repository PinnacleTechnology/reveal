use clap::clap_app;
use serde_json;
use serde_yaml;
use serde_derive::{Deserialize, Serialize};
use std::error::Error;
use std::fs::File;
use std::io::{stdin, stdout, Read};

use f3df;

#[derive(Serialize)]
enum Output {
    FileSector(f3df::Sector),
    RenderableSector(Vec<f3df::renderables::Face>),
}

fn run() -> Result<(), Box<dyn Error>> {
    let matches = clap_app!(("f3df-dump") =>
        (@arg file: +takes_value)
        (@arg yaml: -y --yaml)
        (@arg compact: -c --compact)
        (@arg renderables: -r --renderables)
    )
    .get_matches();

    let file = matches.value_of("file");
    let use_yaml = matches.is_present("yaml");
    let use_compact = matches.is_present("compact");
    let to_renderables = matches.is_present("renderables");

    let reader: Box<dyn Read> = if let Some(file) = file {
        Box::new(File::open(file)?)
    } else {
        Box::new(stdin())
    };

    let file_sector = f3df::parse_sector(reader)?;
    let sector: Output = if to_renderables {
        Output::RenderableSector(f3df::renderables::convert_sector(&file_sector))
    } else {
        Output::FileSector(file_sector)
    };

    if use_compact {
        serde_json::to_writer(stdout(), &sector)?;
    } else if use_yaml {
        serde_yaml::to_writer(stdout(), &sector)?;
    } else {
        serde_json::to_writer_pretty(stdout(), &sector)?;
    }

    Ok(())
}

fn main() {
    run().unwrap();
}
