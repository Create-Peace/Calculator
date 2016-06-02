window.onload = function() {

    var txtShow = document.getElementById('output');
    //
    var keyBtn = document.getElementById('keyBtn');

    // 计算中要用到的变量
    var formulaToShow = '0'; //要显示的计算式
    var formulaToCalcu = '0'; //要计算的计算式
    var num = '0';
    var flag = false;


    //使用事件代理获取按键内容
    keyBtn.onclick = function(e) {
        var ev = e || event;
        var target = ev.target || ev.srcElement;
        console.log(target.value);
                if (flag) {
                formulaToShow = 0;
                flag = false;
            }
        TypeFormula(target.value);
    }



    //生成计算式的函数
    function TypeFormula(com) {


        //得到按钮信息
        switch (com != undefined) {
            //清空

            case /C/.test(com):

                formulaToShow = "0";
                break;

            case /←/.test(com): //退格（这个写的有些冗余）

                var f = formulaToShow;
                if (f != 0) {
                    if (f.substring(f.length - 5, f.length) == "asin(" || f.substring(f.length - 5, f.length) == "acos(")
                        formulaToShow = formulaToShow.substring(0, formulaToShow.length - 5);
                    else if (f.substring(f.length - 4, f.length) == "sin(" || f.substring(f.length - 4, f.length) == "cos(")
                        formulaToShow = formulaToShow.substring(0, formulaToShow.length - 4);

                    else
                        formulaToShow = formulaToShow.substring(0, formulaToShow.length - 1);
                }
                break;


            case /=/.test(com): //计算结果


                formulaToCalcu = formulaToShow.toString();
                formulaToCalcu = formulaToCalcu.replace(/sin\(/g, "Math.sin(Math.PI/180*");
                formulaToCalcu = formulaToCalcu.replace(/cos\(/g, "Math.cos(Math.PI/180*");
                formulaToCalcu = formulaToCalcu.replace(/tan\(/g, "Math.tan(Math.PI/180*");
                formulaToCalcu = formulaToCalcu.replace(/aMath.sin\(/g, "Math.asin(Math.PI/180*");
                formulaToCalcu = formulaToCalcu.replace(/acos\(/g, "Math.acos(Math.PI/180*");
                formulaToCalcu = formulaToCalcu.replace(/aMath.cos\(/g, "Math.acos(Math.PI/180*");

                try {
                    flag = true;
                    var subShow = formulaToShow;
                    formulaToShow = doIt(formulaToCalcu);
                    formulaToShow = parseFloat(formulaToShow.toFixed(8));
                    if( /Infinity|NaN/.test(formulaToShow ) ) throw "除数不能为零";
                } catch (exception) {
                    formulaToShow = 0;
                    window.alert('非法输入！');
                }
                break;
                // 变换符号
            case /[+\-*\/]/.test(com) && /[+\-*\/.]$/.test(formulaToShow):
            formulaToShow =  formulaToShow.slice(0, formulaToShow.length-1);
            formulaToShow += com;
            console.log(formulaToShow);
            break;
            //当前显示为sin()或者cons()
            case/[0-9]/.test(com) && /s\(\d*\)|n\(\d*\)$/.test(formulaToShow):
                formulaToShow = formulaToShow.slice(0, formulaToShow.length-1);
                formulaToShow += com + ')';
                break;
                //当前显示零的时候输入数字
            case /[0-9]|\-|\(|s\(|n\($/.test(com) && (formulaToShow == "0"):
                formulaToShow = com;
                // txtShow.value = com;
                break;
                //防止间隔重复输入 '.'
            case /[.]/.test(com) && /\d+[.]$|\d+[.]\d+$/.test(formulaToShow):
                break;
                //防止间隔重复输正余弦
            case /s\(|n\($/.test(com) && /s\(|n\(|[0-9]$/.test(formulaToShow):
                break;


            default:

                formulaToShow += com;


        }
        txtShow.value = formulaToShow;
    }

}

// 执行表达式
function doIt(oPut) {
    //对浮点数进行处理
    var temp = "return " + oPut;
    console.log(temp);
    var a = new Function(temp);
    return a();
}
