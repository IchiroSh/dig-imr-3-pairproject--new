
const questionList = [
    {
        questionID:1,
        correct:"Hello World!",
        question:"console.log()を使用し Hello World! を出力してください",
        help:"https://developer.mozilla.org/ja/docs/Web/API/console/log"
    },
    {
        questionID:2,
        correct:"10",
        question:"引数を2つ取り合計値が10になる関数を作り結果を出力してください",
        help:"https://developer.mozilla.org/ja/docs/Web/JavaScript/Guide/Functions"
    }
];



const scoringBtn = document.querySelector('.editor__scoring');
let display = [];
scoringBtn.addEventListener('click', () => {
    let answer = localStorage.outputArgMessage
    let test = display[2];
    // console.log("answer" + answer);
    // console.log("test" + test);
    if (answer === test){
        document.getElementById('reply').textContent = "OK!"
        selectBtn.textContent = "clear!!!";
        selectBtn.style.backgroundColor = "#48BF0A";
    }else{
        document.getElementById('reply').textContent = "Wrong・・・"
    }
});

const selectMode = document.querySelectorAll('.select__mode');
let selectBtn;
for(let i = 0;i < selectMode.length; i++){
    selectMode[i].addEventListener('click', () =>{
        display = [
            questionList[i].questionID,
            questionList[i].question,
            questionList[i].correct,
            questionList[i].help
            ];
        // alert(display);
        selectBtn = selectMode[i];
        document.getElementById('question').textContent = display[1];
        document.getElementById('reply').textContent = "Let's challenge!";
        document.getElementById('help').href = display[3];
    });
}