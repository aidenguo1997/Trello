function getDes(data){
    description = data.trim().replace(/#|\n|TestCases|TestCase/g, '');
    return  description
}


function getStatus(data, condition){
    if (data == condition){
        return "PASS";
    } else {
        return  "FAIL";
    }
}


function accordionTr(feature){
    let tr = "";
    let scenario = feature.scenarioResults
    for(let i=0; i<(scenario.length); i++){
        let status = getStatus(scenario[i]["failed"], "false")
        let trTemplate = 
        `<tr>
            <th scope="row">${scenario[i]['name']}</th>
            <td class="time" scope="row">${scenario[i]['durationMillis']}</td>
            <td class="${status.toLowerCase()}">${status}</td>
        </tr>`
        tr += trTemplate;
    }
    return  tr
}


function cardDiv(feature, times){
    let div = "";
    let cardTemplate = "";
    let endPoint = feature.endPoint
    for(let i=0; i<(feature.endPoint.length); i++){
        icon = "fa-circle-check"
        let resultClass = endPoint[i].result.toLowerCase();
        if (resultClass == "not test"){
            resultClass = resultClass.replace(" ","_")
            icon = "fa-circle-exclamation"
        } else if (resultClass == "fail"){
            icon = "fa-circle-xmark"
        }
        let divTemplate = 
        `<div class="${endPoint[i].method}">
            <span class="method">${endPoint[i].method.toUpperCase()}</span>
            <span>${endPoint[i].strEndPoint}</span>
            <span class="status ${resultClass}"><i class="fa-solid ${icon}"></i>${endPoint[i].result}</span>
        </div>`
        div += divTemplate;
    }
    cardTemplate =
    `<div class="card">
        <div class="card-header collapsed" data-toggle="collapse" data-target="#collapseTwo${times}"
            aria-expanded="false" aria-controls="collapseTwo">
            <span class="title">Endpoint view</span>
            <span class="icon"><i class="fas fa-angle-down rotate-icon"></i></span>
        </div>
        <div id="collapseTwo${times}" class="collapse" data-parent="#accordionExample">
            <div class="card-body">
                ${div}
            </div>
        </div>
    </div>`
    return  cardTemplate
}

function accordion(feature, times){
    accordionTemplate =
    `<div class="accordion" id="accordionExample">
        <div class="card">
            <div class="card-header" data-toggle="collapse" data-target="#collapseOne${times}" aria-expanded="true">
                <span class="title">Test result</span>
                <span class="icon"><i class="fas fa-angle-down rotate-icon"></i></span>
            </div>
            <div id="collapseOne${times}" class="collapse show" data-parent="#accordionExample">
                <div class="card-body">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Time</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${accordionTr(feature)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        ${cardDiv(feature, times)}
    </div>`
    return  accordionTemplate
}


function createReport(data,testTimes){
    let result = "";
    let status = "";
    let passNum = 0
    let failNum = 0
    let totalNum = 0
    let successRate = 0
    let description = getDes(data[0].README);
    for (let i = 1;i<testTimes;i++){
        status = getStatus(data[i]['scenariosfailed'], "0")
        passNum += parseInt(data[i]['scenariosPassed'], 10)
        failNum += parseInt(data[i]['scenariosfailed'], 10)
        totalNum = passNum + failNum
        successRate = (passNum/totalNum)*100
        
        content =
        `<li>
            <div class="item">
                <span class="date">${data[i]['resultDate']}</span>
                <table class="content">
                    <tbody>
                        <tr>
                            <th scope="col">Description:</th>
                            <td><a href="report_${data[i]['version']}/karate-reports/karate-summary.html" target="_blank">${description}</a></td>
                        </tr>
                        <tr>
                            <th scope="col">Total Time:	  </th>
                            <td>${data[i]['totalTime']} ms</td>
                        </tr>
                        <tr>
                            <th scope="col">API Version:</th>
                            <td class="ver">${data[i]['version']}</td>
                        </tr>
                        <tr>
                            <th scope="col">Test Case Version:</th>
                            <td class="ver">${data[i]['testCaseVersion']}</td>
                        </tr>
                        <tr>
                            <th scope="col">Status:	  </th>
                            <td class="${status.toLowerCase()}">${status}</td>
                        </tr>
                    </tbody>
                </table>
                ${accordion(data[i], i)}
            </div>
        </li>`
        result += content;
    }
    summary = 
    `
    <table class="table border border-dark text-center summary">
        <thead class="borders ${status.toLowerCase()}"">
            <tr>
                <th colspan="4">Test Result Summary</th>
            </tr>
        </thead>
        <thead class="borders">
            <tr>
                <th scope="col">Total</th>
                <th scope="col">Passed</th>
                <th scope="col">Failed</th>
                <th scope="col">Success Rate</th>
            </tr>
        </thead>
        <tbody class="borders">
                <tr>
                    <td>${totalNum}</td>
                    <td>${passNum}</td>
                    <td>${failNum}</td>
                    <td>${successRate}%</td>
                </tr>
        </tbody>
    </table>
    <ul class="timeline" id="timeline">
        ${result}
    </ul>
    `
    document.getElementById('box').innerHTML = summary;
}


function reportStatus() {
    if (oXHR.readyState == 4) {
        const data = JSON.parse(this.responseText);
        const testTimes = data.length;
        createReport(data, testTimes);
    }
}


let oXHR = new XMLHttpRequest();
let failed = "";
oXHR.onreadystatechange = reportStatus;
oXHR.open("GET", "result.json", true);
oXHR.send();