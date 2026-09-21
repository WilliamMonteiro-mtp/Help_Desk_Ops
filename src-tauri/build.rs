fn main() {
    let mut attrs = tauri_build::WindowsAttributes::new();
    attrs = attrs.app_manifest(include_str!("app.manifest"));
    
    tauri_build::try_build(
        tauri_build::Attributes::new().windows_attributes(attrs)
    ).expect("failed to run build script");
}
