import { lib, game, ui, get, _status } from "noname";
async function creatTL() {
    if (lib.config.show_splash !== "off") {
        const cfm = confirm("【雷霆】请注意：运行本扩展需关闭系统默认的启动页，点击确定为您关闭并重启，或点击取消关闭本扩展")
        if (cfm) {
            game.saveConfig("show_splash", "off");
        } else {
            game.saveConfig("extension_雷霆_enable", false);
        }
        game.reload();
    }
    if (localStorage.getItem(lib.configprefix + "directstart")) return;
    const iframe = document.createElement('iframe');
    iframe.id = "xl_thunderLobby";
    iframe.src = `${lib.assetURL}extension/雷霆/app.html`;
    iframe.style.cssText = "width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:99999";
    document.documentElement.appendChild(iframe);
    const modules = { lib, game, ui, get };
    for (const key in modules) {
        iframe.contentWindow[key] = modules[key];
    }
    window.addEventListener('message', (e) => {
        if (e.data.type === 'CLOSE_THUNDERLOBBY') {
            const iframe = document.getElementById('xl_thunderLobby');
            if (iframe) { iframe.remove(); }
            if (ui.backgroundMusic) game.playBackgroundMusic();
        }
    });
}
export { creatTL as precontent }
