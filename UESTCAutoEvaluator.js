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
    //console.log(nowurl);
    if (nowurl.includes("evaluate")) {
        setInterval(StartEvaluate, "400");
    }
}

var begin = setInterval(WindowDraw, "5");


function WindowDraw() {
    nowurl = location.pathname;
    // 绘制窗口
    if (nowurl.includes("evaluate")) {
        // 主题
        var style_btn = 'float:right;background:rgba(228,228,228,0.4); cursor:pointer; margin:0px 1px 0px 0px; padding:0px 3px;color:black; border:2px ridge black;border:2px groove black;';
        var style_win_top = 'z-index:998; padding:6px 10px 8px 15px;background-color:lightGrey;position:fixed;left:5px;top:5px;border:1px solid grey; ';
        var style_win_buttom = 'z-index:998; padding:6px 10px 8px 15px;background-color:lightGrey;position:fixed;right:5px;bottom:5px;border:1px solid grey;  ';
        // 开始绘制
        var newDiv = document.createElement("div");
        newDiv.id = "controlWindow";
        newDiv.align = "left";
        document.body.appendChild(newDiv);
        GM_addStyle("#controlWindow{" + style_win_top + " }");
        var table = document.createElement("table");
        newDiv.appendChild(table);
        var th = document.createElement("th");
        th.id = "headTd";
        var thDiv = document.createElement("span");
        thDiv.id = "thDiv";
        thDiv.innerHTML = "UESTC Evaluator";
        GM_addStyle("#thDiv{color:red;font-size: 10pt;}");
        th.appendChild(thDiv);
        table.appendChild(th);
        var tr = document.createElement("tr");
        table.appendChild(tr);
        var tr2 = document.createElement("tr");
        table.appendChild(tr2);
        var td = document.createElement("td");
        td.id = "footTd";
        var td2 = document.createElement("td");
        td2.id = "footTd2";
        tr.appendChild(td);
        tr2.appendChild(td2);
        var close = document.createElement("span");
        close.id = "close";
        close.innerHTML = "关闭弹窗";
        close.addEventListener("click", function () { document.body.removeChild(document.getElementById("controlWindow")); }, false);
        td.appendChild(close);
        GM_addStyle("#close{" + style_btn + "}");
        var score = document.createElement("span");
        score.id = "score";
        score.innerHTML = "开始评教";
        score.addEventListener("click", AutoEvaluate);
        td.appendChild(score);
        GM_addStyle("#score{" + style_btn + "}");
        var star = document.createElement("span");
        star.id = "star";
        star.innerHTML = "联系作者";
        star.addEventListener("click", function () { window.open("https://github.com/FoxSuzuran", "_blank"); });
        td2.appendChild(star);
        GM_addStyle("#star{" + style_btn + "}");
        var open = document.createElement("span");
        open.id = "open";
        open.innerHTML = "项目地址";
        open.addEventListener("click", function () { window.open("https://github.com/FoxSuzuran/UESTCAutoEvaluator", "_blank"); });
        td2.appendChild(open);
        GM_addStyle("#open{" + style_btn + "}");
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
            //console.log(now_classname);
            //console.log(last_classname);
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