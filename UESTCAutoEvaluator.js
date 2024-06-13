// ==UserScript==
// @name         电子科技大学自动评教脚本
// @namespace    https://github.com/FoxSuzuran
// @version      1.0
// @description  电子科技大学自动评教脚本,只需要进到评教界面（打星那个界面）点击运行即可,最后要手动点一下提交
// @author       Suzuran
// @match        https://eams.uestc.edu.cn/eams/*
// @icon         http://picgo.malossov.top/malpicbed/UESTCico.jpg
// @grant        GM_addStyle
// @grant        unsafeWindow
// ==/UserScript==

var mainPage = "https://eams.uestc.edu.cn/eams/evaluate/*";
var tearcherStarPage = "https://eams.uestc.edu.cn/eams/evaluate!search.action";
var textbookSelectPage1 = "https://eams.uestc.edu.cn/eams/evaluate!textbookEvalIndex.action";
var textbookSelectPage2 = "https://eams.uestc.edu.cn/eams/evaluate!finishAnswer.action";
var textbookCommentPage = "https://eams.uestc.edu.cn/eams/evaluate!textbookEval.action?evaTextbook.id";
var teacherCommentPage = "https://eams.uestc.edu.cn/eams/evaluate!loadQtnaire.action";
var nowurl = location.pathname;
var last_classname = "";

unsafeWindow.confirm = function confirm() {
    return true;
}

function AutoEvaluate() {
    if (nowurl.includes("evaluate")) {
        setInterval(StartEvaluate, 400);
    }
}

var begin = setInterval(WindowDraw, 5);

function WindowDraw() {
    nowurl = location.pathname;
    if (nowurl.includes("evaluate")) {
        // 主题
        var style_btn = 'background:none; color:#9370DB; padding:4px 8px; margin:4px; border:2px solid #9370DB; border-radius:6px; cursor:pointer; text-align:center; text-decoration:none; display:inline-block; font-size:12px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);';
        var style_win = 'z-index:998; padding:10px; background-color:#ffebef; box-shadow:0 0 15px rgba(0,0,0,0.3); border-radius:10px; position:fixed; left:10px; top:10px; border:1px solid #C71585; width:180px;';

        // 开始绘制
        var newDiv = document.createElement("div");
        newDiv.id = "controlWindow";
        newDiv.align = "left";
        document.body.appendChild(newDiv);
        GM_addStyle("#controlWindow{" + style_win + "}");

        var header = document.createElement("div");
        header.style.fontSize = "14px";
        header.style.marginBottom = "10px";
        header.style.color = "#C71585";
        header.style.textAlign = "center";
        header.innerHTML = "UESTC Evaluator";
        newDiv.appendChild(header);

        var btnContainer = document.createElement("div");
        btnContainer.style.display = "grid";
        btnContainer.style.gridTemplateColumns = "1fr 1fr";
        btnContainer.style.gap = "4px";
        btnContainer.style.justifyItems = "center";
        newDiv.appendChild(btnContainer);

        var close = document.createElement("button");
        close.id = "close";
        close.innerHTML = "关闭弹窗";
        close.addEventListener("click", function () { document.body.removeChild(document.getElementById("controlWindow")); }, false);
        close.style.cssText = style_btn;
        btnContainer.appendChild(close);

        var score = document.createElement("button");
        score.id = "score";
        score.innerHTML = "开始评教";
        score.addEventListener("click", AutoEvaluate);
        score.style.cssText = style_btn;
        btnContainer.appendChild(score);

        var star = document.createElement("button");
        star.id = "star";
        star.innerHTML = "联系作者";
        star.addEventListener("click", function () { window.open("https://github.com/FoxSuzuran", "_blank"); });
        star.style.cssText = style_btn;
        btnContainer.appendChild(star);

        var open = document.createElement("button");
        open.id = "open";
        open.innerHTML = "项目地址";
        open.addEventListener("click", function () { window.open("https://github.com/FoxSuzuran/UESTCAutoEvaluator", "_blank"); });
        open.style.cssText = style_btn;
        btnContainer.appendChild(open);

        clearInterval(begin);
    }
}

function StartEvaluate() {
    nowurl = location.pathname;
    console.log(nowurl);

    if (tearcherStarPage.includes(nowurl)) {
        const fiveStarsNum = 4;
        const items = [...document.querySelectorAll("input[type='hidden']")].filter(
            item => item.id.includes("starNum")
        );
        items.slice(0, fiveStarsNum).forEach(item => (item.value = "5"));
        items.slice(fiveStarsNum).forEach(item => (item.value = "4"));
        document.querySelector("input[value='下一步']").click();
    }
    if (textbookSelectPage1.includes(nowurl) || textbookSelectPage2.includes(nowurl)) {
        var items = [...document.querySelectorAll("a[onclick]")];
        if (items.length != 0) {
            items[0].click();
        } else {
            document.querySelector("input[value='提交，进入教师评教']").click();
        }
    }
    if (textbookCommentPage.includes(nowurl)) {
        document
            .querySelectorAll("input[type='radio'][value='0']")
            .forEach(item => (item.checked = true));
        document.querySelector("#sub").click();
    }
    if (teacherCommentPage.includes(nowurl)) {
        var now_classname = document.querySelectorAll("tr")[1].textContent;
        [...document.querySelectorAll("input[type='hidden']")]
            .filter(item => item.id.includes("starNum"))
            .forEach(item => (item.value = "5"));
        document
            .querySelectorAll("input[type='checkbox']")
            .forEach(item => (item.checked = true));
        document.querySelector("#evaText").textContent = "教学态度好，教学内容吸引人" + Math.random();
        try {
            if (now_classname != last_classname) {
                console.log("click");
                document.querySelector("input[value='下一步']").click();
                last_classname = now_classname;
            }
        } catch {
            document.querySelector("input[value='确认']").click();
        }
    }
}
