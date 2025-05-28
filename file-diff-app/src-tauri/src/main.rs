// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::command;

#[tauri::command]
async fn compare_files_content(content1: String, content2: String) -> Result<Vec<String>, String> {
    // Create a patch from the two contents
    let patch = diffy::create_patch(&content1, &content2);
    
    let mut diff_output: Vec<String> = Vec::new();

    for hunk in patch.hunks() {
        for line in hunk.lines() {
            match line.line_type() {
                diffy::LineType::Added => {
                    diff_output.push(format!("+ {}", line.content().trim_end_matches('\n')));
                }
                diffy::LineType::Removed => {
                    diff_output.push(format!("- {}", line.content().trim_end_matches('\n')));
                }
                diffy::LineType::Context => { // Common line
                    diff_output.push(format!("  {}", line.content().trim_end_matches('\n')));
                }
            }
        }
    }
    
    if diff_output.is_empty() && content1 == content2 {
        diff_output.push("  Files are identical.".to_string());
    } else if diff_output.is_empty() && !content1.is_empty() && !content2.is_empty() && content1 != content2 {
        diff_output.push("~ Files are different (no specific line changes detected by diffy, or only metadata changes).".to_string());
    } else if diff_output.is_empty() && (content1.is_empty() || content2.is_empty()) && content1 != content2 {
        if content1.is_empty() {
            content2.lines().for_each(|line| diff_output.push(format!("+ {}", line)));
        } else { // content2 is empty
            content1.lines().for_each(|line| diff_output.push(format!("- {}", line)));
        }
    }

    Ok(diff_output)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![compare_files_content]) // Add your command here
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
