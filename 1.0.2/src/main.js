import * as tl from "./utils.js";
import SkinManager from "./SkinManager.js";
import LoginPage from './login.js';
import HallPage from './hall.js';
import GeneralPage from './general.js';
import GeneralInfoPage from './generalInfo.js';
import SkinPage from './skin.js';
import SkinInfoPage from './skinInfo.js';
import SettingPage from './setting.js';
import RankPage from './rank.js';
import MatchPage from './match.js';
import PageManager from './PageManager.js';
import { tlui } from "./ui.js";
import { tluser } from "./User.js";
import { dyManager } from "./DynamicManager.js";
if (tl.getConfig("basic_eruda") === "开启") eruda.init();
// tl.tryLoadLib();
console.log(lib)
const pixiContainer = document.getElementById("pixiContainer");
const dpr = Math.max(window.devicePixelRatio * (window.documentZoom ? window.documentZoom : 1), 1);
const pixiApp = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  antialias: true,
  resolution: dpr || 1,
  autoDensity: true,
  powerPreference: 'high-performance',
  resizeTo: window,
  backgroundAlpha: 0,
});
pixiContainer.appendChild(pixiApp.view);
await dyManager.init();
const mainContainer = document.getElementById("pageContainer");
const backContainer = document.getElementById("backContainer");
const pageManager = new PageManager(pixiApp);
const pageConfig = [
  { name: 'login', cls: LoginPage, path: 'pages/famous/login.html', options: { cache: false } },
  { name: 'hall', cls: HallPage, path: 'pages/famous/hall.html' },
  { name: 'general', cls: GeneralPage, path: 'pages/famous/general.html' },
  { name: 'generalInfo', cls: GeneralInfoPage, path: 'pages/famous/generalInfo.html' },
  { name: 'skin', cls: SkinPage, path: 'pages/famous/skin.html' },
  { name: 'skinInfo', cls: SkinInfoPage, path: 'pages/famous/skinInfo.html' },
  { name: 'setting', cls: SettingPage, path: 'pages/famous/setting.html' },
  { name: 'rank', cls: RankPage, path: 'pages/famous/rank.html' },
  { name: 'match', cls: MatchPage, path: 'pages/famous/match.html' },
];
pageConfig.forEach(({ name, cls, path, options = {} }) => {
  pageManager.registerPage(name, cls, `${lib.assetURL}${path}`, {
    cache: options.cache ?? true,
    needRepaint: options.needRepaint ?? false,
    htmlContainer: tlui.createPageHtmlContainer(name, mainContainer, "tlpages"),
    backHtmlContainer: tlui.createPageHtmlContainer(`${name}_back`, backContainer, "tlpages-back"),
  });
});

const fromLogin = sessionStorage.getItem("thunderLobby") ? false : true;
const enterPage = sessionStorage.getItem("thunderLobby") ? "hall" : "login";
const spineConfigPromise = dyManager.loadConfig();
export async function loadHall() {
  if (enterPage === "hall") return null;
  await spineConfigPromise;
  return dyManager.loadSpine(dyManager.getPageSpine(1), "hallPage");
}
spineConfigPromise.then(() => {
  const enterPageSpine = dyManager.getPageSpine(fromLogin ? 0 : 1);
  dyManager.loadSpine(enterPageSpine, `${enterPage}Page`).then(() => {
    document.getElementById("loading").classList.add("hide");
    pageManager.gotoPage(enterPage);
  });
}).catch(err => {
  console.error("加载失败：", err);
});
const skinManager = new SkinManager();
skinManager.initAllCharacterSkins();
export { pageManager, skinManager, pixiApp };



/* 下面是用于屏幕对比的，可删 */
function initKeyboardControl() {
  const duibiDiv = document.getElementById('duibi');
  if (!duibiDiv) return;
  let opacity = 0.5;
  const opacityStep = 0.1;
  document.addEventListener('keydown', (e) => {
    if (['F1', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
    }
    if (e.key === 'F1') {
      const currentDisplay = window.getComputedStyle(duibiDiv).display;
      duibiDiv.style.display = currentDisplay === 'none' ? 'block' : 'none';
    }
    if (e.key === 'ArrowUp') {
      opacity = Math.min(opacity + opacityStep, 1); // 不超过 1
      duibiDiv.style.opacity = opacity;
    }
    if (e.key === 'ArrowDown') {
      opacity = Math.max(opacity - opacityStep, 0); // 不低于 0
      duibiDiv.style.opacity = opacity;
    }
  });
}
initKeyboardControl()
// window.addEventListener('DOMContentLoaded', initKeyboardControl);