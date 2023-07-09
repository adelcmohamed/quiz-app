let countspan =document.querySelector(".count span");
let bulletsspancontainer = document.querySelector(".bullets .spans");
let quizarea =document.querySelector(".quiz-area");
let answer_area = document.querySelector(".answers-area");
let submitbutton = document.querySelector(".submit-button");
let bulletselement = document.querySelector(".bullets");
let resultscontainer = document.querySelector(".results");
let countdownko = document.querySelector(".countdown");
let currentindex =0;
let countofrightanswers = 0;
let countdowninterval;
function getquestion(){
    myrequest = new XMLHttpRequest();
    myrequest.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200)
        {
            let questionobject = JSON.parse(this.responseText)
            let questioncount = questionobject.length;
            
            // creats bullets and set questions count
            createbullets(questioncount);
            addquestiondata(questionobject[currentindex],questioncount);

            // start countdown
            countdown(5,questioncount);

            submitbutton.onclick=function(){
                // get right answer
                let rightanswer = questionobject[currentindex].right_answer;
                // increase current index
                currentindex++;
                // check answer
                checkanswer(rightanswer,questioncount);

                // remove previouw click
                quizarea.innerHTML="";
                answer_area.innerHTML="";

                addquestiondata(questionobject[currentindex],questioncount);

                // handel bullets classe
                handelbullets()
                clearInterval(countdowninterval);
                countdown(5,questioncount);
                showresults(questioncount);
            }
            



        }
    };
    myrequest.open("Get","html-question.json",true);
    myrequest.send();
}
getquestion();



function createbullets(num){
    countspan.innerHTML = num;

    // create span
    for(let i = 0 ; i < num; i++){
         // create bullets
        let bullets = document.createElement("span");
        

        bulletsspancontainer.append(bullets);
    }
}

function addquestiondata(obj,count){
    if(currentindex < count){
         // create h2 question titel
    let questiontitel = document.createElement("h2");

    // create question text
    let questiontext = document.createTextNode(obj["title"]);
    // appen text to h2
    questiontitel.appendChild(questiontext);

    // append h2 to quiz area
    quizarea .appendChild(questiontitel);
    // create answers
    for(let i= 1 ; i<=4;i++){
        // create div answer
        let maindiv = document.createElement("div");
        // add class to main div
        maindiv.className="answer";
        // create radio input
        let radioinput = document.createElement("input");
        // add type name id data-attribute
        radioinput.type='radio';
        radioinput.name='question';
        radioinput.id=`answer_${i}`;
        radioinput.dataset.answer = obj[`answer_${i}`];
        // create laber
        let thelabel = document.createElement("label");
        // add for attribue
        thelabel.htmlFor = `answer_${i}`;
        // creat label text
        let thelabeltext = document.createTextNode(obj[`answer_${i}`]);
        // add text to label
        thelabel.appendChild(thelabeltext);
        // add input to div
        maindiv.appendChild(radioinput);
        maindiv.appendChild(thelabel);
        // add all to answers area
        answer_area.appendChild(maindiv);
    }
    }
}
function checkanswer(ranswer,count){
    let answers = document.getElementsByName("question");
    let choosenanswer;
    for(let i =0;i<answers.length;i++){
        if(answers[i].checked){
            choosenanswer=answers[i].dataset.answer;
        }
    }

    if(ranswer === choosenanswer){
        countofrightanswers ++;
        console.log("good answers")
    }
}
function handelbullets(){
    let bulletsspans = document.querySelectorAll(".bullets .spans span");
    let arryspans = Array.from(bulletsspans);
    arryspans.forEach((span,index) => {
        if(currentindex === index){
            span.className = "on";
        }
    });
}
function showresults(count){
    let theresults;
    if(currentindex === count){
        quizarea.remove();
        answer_area.remove();
        submitbutton.remove();
        bulletselement.remove();

   
    if(countofrightanswers > (count/2) && countofrightanswers < count){
        theresults =  `<span class="good">good<span> ${countofrightanswers} from ${count} `
    }else if(countofrightanswers === count){
        theresults =  `<span class="perfect">good<span> ${countofrightanswers} from ${count}`
    }else{
        theresults =  `<span class="bad">bad<span> ${countofrightanswers} from ${count}`
    }
    resultscontainer.innerHTML=theresults;
    
}
}


function countdown(duration,count){
    if(currentindex < count){
        let minutes,secends;
        countdowninterval = setInterval(function(){
            minutes = parseInt(duration / 60);
            secends = parseInt(duration % 60);
            minutes = minutes < 10 ?`0${minutes}:`:minutes;
            secends = secends < 10 ?`0${secends}`:secends;
            countdownko.innerHTML = `${minutes} ${secends}`;
            if(--duration < 0){
                clearInterval(countdowninterval);
                submitbutton.click();
            }
        },1000);
    }
}