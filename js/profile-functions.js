//every refresh will scrool to top
$('body, html').animate({ scrollTop: 0 });


//log off func
const logout = document.getElementById('log-out')
logout.addEventListener('click', e => {
  auth.signOut();
});

// update content by lang choose
function updateContent() {

}

// select sup slider 
let selected
let activeClass
let getSelectedSupID
let getSelectedSupParent
let getSelectedSupSibling
let getMySupName
let lastSupId = getSelectedSupID

$(".form-control").change(function (e) {


  $(this.offsetParent).trigger('mouseenter');
  getSelectedSupID = $(this).attr("id")
  getSelectedSupParent = $(this.offsetParent).attr("id")
  getMySupName = $(this).parent().find("span")[0].innerText
  mySlider(getSelectedSupID, getSelectedSupParent)
  $("#loader").css("display", "block");

  let id = $(this.offsetParent)
  let pos = id.offset().top;
  $('body, html').animate({ scrollTop: pos - 50 });

  if (typeof lastSupId == 'undefined') {
    lastSupId = getSelectedSupID
    supARR = []
    return false
  }

  if (lastSupId != getSelectedSupID) {

    lastSupId = getSelectedSupID
    supARR = []
    supAmount = 0
    chosedSups = 0
    $("#my-selected-supps").html(chosedSups)
  }
})


function selectSup(currentTab) {
  $('.sup-budget-border').removeClass('sup-budget-border');
  activeClass = currentTab;
  $('#suppliers .sup-budget#' + activeClass).addClass('sup-budget-border');

};

$('#suppliers .sup-budget').mouseenter(function () {
  getSelectedSupSibling = $(this.nextElementSibling)
  selected = $(this).attr('id');
  selectSup(selected);
});






//general parms
let lastRG;
let supAmount = 0;
let chosedSups = 0;
let lastSelectedSup

//tool tip range input change
function slidemoved(data) {
  $(data).parent().children(2).children(1).children(1).text(data.value)
}

//slider function
function mySlider(getSelectedSupID, getSelectedSupParent) {

  auth.onAuthStateChanged(function (user) {
    let html = "";
    let rg = $("#" + getSelectedSupID)
    lastRG = rg.val()
    lastSelectedSup = getSelectedSupID
    rg.parent().children(2).children(1).children(1).text(lastRG)
    dataBase.ref('users/' + user.uid).once('value').then(function (snapshot) {
      let mySupp = snapshot.child('CurrentWed').child(getSelectedSupID).val();
      dataBase.ref('supliers/' + getSelectedSupParent).once('value').then(function (snapshotor) {
        let allSupp = snapshotor.val()
        if (mySupp == '') {
          $("#loader,#suppliers-choosed,#contract-on,#go-next-supp").css("display", "none");
          $("#suppliers-on").css("display", "block");
          $("#submit-all-supp").css("display", "inline-block");
          for (let key in allSupp) {
            let fivePresentUP = allSupp[key].price * 1.05
            //let fivePresentBottom = allSupp[key].price * .95
            let supClicked = {"clicked" : true}

                   //remove double supps from allsupps array
                   for(let i=0;i<supARR.length;i++){
                    for(let key in allSupp){
                      if (supARR[i].supName === allSupp[key].name){
                
                         
                         allSupp[key]['clicked'] = true;  
                               
                      }
                    }
                  }

            if (parseInt(lastRG) <= parseInt(fivePresentUP) && parseInt(lastRG) >= parseInt(allSupp[key].price)) {

              supAmount++
              html += '<div class="sup">'
              html += '<div class="sup-img inline-block">'
              html += '<img src=' + allSupp[key].logo + ' class="sup-image-class">'
              if(allSupp[key]['clicked']){
                html += '<div onclick="selectedSup(event)" class="pc after-select-check"></div>'
              }else{
                html += '<div onclick="selectedSup(event)" class="contact-supp pc">בחר</div>'
              }
              
              html += '</div>'
              html += '<div class="sup-text text-justify inline-block">'
              html += '<a href="/suppliers.html#' + allSupp[key].name + '" target="_blank" id="' + [key] + '" class="a main-text text-right">' + allSupp[key].name + '</a>'
              html += '<img src="images/stars.png" class="sup-text-class">'
              html += '<p class="p-text">' + allSupp[key]["long description"].substring(0, 90) + '</p>'
              if(allSupp[key]['clicked']){
                html += '<div onclick="selectedSup(event)" class="mob after-select-check"></div>'
              }else{
                html += '<div onclick="selectedSup(event)" class="contact-supp mob">בחר</div>'
              }
              
              html += '</div>'
              html += '</div>'
              html += "<span style='display:none'>" + allSupp[key].coverphoto1 + "</span>"
              html += "<span style='display:none'>" + allSupp[key]["for what"] + "</span>"
              html += "<span style='display:none'>" + allSupp[key].gift + "</span>"
            }
          }


          $(".supplier-qan").html(supAmount)
          $("#sup-warp").html(html)
          $(".supplier-name").text(getMySupName)
          let suptext = $(".supplier-name")[0].innerHTML
          if (suptext == "עלות מנה") {

            $(".supplier-name").text("אולם אירועים")
          }
          html = "";
          supAmount = 0




        } else {
          

          if ([Object.keys(mySupp)[Object.keys(mySupp).length - 1]] == "contract") {

            $("#loader,#suppliers-on,#suppliers-choosed,#submit-all-supp").css("display", "none");
            $("#contract-on,#go-next-supp").css("display", "block");
            $("#go-next-supp").css("display", "inline-block");
            html += '<div class="sup sup-contract-end">'
            html += '<div class="sup-img-contract"><img src="' + mySupp.contract.cover + '"/>'
            html += '</div>'
            html += '<div class="warp-text-contract">'
            html += '<div class="right-text-contract inline-block"><span id="warp-logo"><img id="contract-logo" src="' + mySupp.contract.logo + '"/></span><div id="contract-name-in">' + mySupp.contract.contractName + '<img src="images/stars.png"></span></div></div>'
            html += '<div class="left-text-contract inline-block"><div id="red-contract-price">₪' + mySupp.contract.price + '</div>לאירוע</div>'
            html += '</div>'
            html += '<div class="sup-contract-details">'
            html += '<h4 class="bold text-right">פרטי הספק</h4>'
            html += '<div class="text-right" id="for-what-contract">' + mySupp.contract.forWhat + '</div>'
            html += '<br><div class="bold text-right" id="gift-content">הטבה מ-<span class="wisewed-red">Wisewed</span></div>'
            html += '<div class="text-right" id="gift-contract">' + mySupp.contract.gift + '</div>'
            html += '</div>'
            html += '<div class="recomand contract-end">כתוב המלצה</div>'
            html += '<div class="cancel-contracts"><div onclick="cancelContract(event)" id="cacnel-cta">החוזה בוטל</div></div>'
            html += '</div>'
            html += '</div>'
          } else {
            for (let i = 0; i < Object.keys(mySupp).length; i++) {
              supAmount++
              $("#loader,#suppliers-on,#contract-on,#go-next-supp").css("display", "none");
              $("#suppliers-choosed").css("display", "block");
              $("#submit-all-supp").css("display", "inline-block");
              html += '<div class="sup sup-contract">'
              html += '<div class="sup-img inline-block">'
              html += '<img src=' + mySupp[i].logo + ' class="sup-image-class">'
              html += '<div onclick="contract(event)" class=" contract-end pc">סגרנו חוזה</div>'
              html += '<div onclick="editRecord(event)"  class="remove-from-contracts pc">הסר מהרשימה</div>'
              html += '</div>'
              html += '<div class="sup-text text-justify inline-block">'
              html += '<a href="/suppliers.html#' + mySupp[i].supName + '"  target="_blank" id="' + [i] + '" class="a main-text text-right">' + mySupp[i].supName + '</a>'
              html += '<img src="images/stars.png" class="sup-text-class">'
              html += '<p class="p-text">' + mySupp[i].desc.substring(0, 90) + '</p>'
              html += '<div onclick="contract(event)" class="contract-end mob">סגרנו חוזה</div>'
              html += '<div onclick="editRecord(event)" class="remove-from-contracts mob">הסר מהרשימה</div>'
              html += '</div>'
              html += '</div>'
              html += "<span style='display:none'>" + mySupp[i].cover + "</span>"
              html += "<span style='display:none'>" + mySupp[i].forWhat + "</span>"
              html += "<span style='display:none'>" + mySupp[i].gift + "</span>"
            }
            html += '<div id="more-supp"><p>ספקים נוספים בתחום</p><div class="mob" id="more-sup-icon"><i class="fa fa-angle-left" aria-hidden="true"></i></div></div>'
           
             
            //remove double supps from allsupps array
            let supClicked = {"clicked" : true}    
            for(let i=0;i<mySupp.length;i++){
              for(let key in allSupp){
                if (mySupp[i].supName === allSupp[key].name){
                  delete allSupp[key]
                                    
                }
              }
            }
       
            
                               //remove double supps from allsupps array
                               for(let i=0;i<supARR.length;i++){
                                for(let key in allSupp){
                                  if (supARR[i].supName === allSupp[key].name){
                            
                                     
                                     allSupp[key]['clicked'] = true;  
                                           
                                  }
                                }
                              }
              for (let key in allSupp) {
                let fivePresentUP = allSupp[key].price * 1.05
                //  let fivePresentBottom = allSupp[key].price * .95
      
                if (parseInt(lastRG) <= parseInt(fivePresentUP) && parseInt(lastRG) >= parseInt(allSupp[key].price)) {
                 
                  html += '<div class="sup">'
                  html += '<div class="sup-img inline-block">'
                  html += '<img src=' + allSupp[key].logo + ' class="sup-image-class">'
                  if(allSupp[key]['clicked']){
                    html += '<div onclick="selectedSup(event)" class="pc after-select-check"></div>'
                  }else{
                    html += '<div onclick="selectedSup(event)" class="contact-supp pc">בחר</div>'
                  }
                  
                  html += '</div>'
                  html += '<div class="sup-text text-justify inline-block">'
                  html += '<a href="/suppliers/' + allSupp[key].name + '" target="_blank" id="' + [key] + '" class="a main-text text-right">' + allSupp[key].name + '</a>'
                  html += '<img src="images/stars.png" class="sup-text-class">'
                  html += '<p class="p-text">' + allSupp[key]["long description"].substring(0, 90) + '</p>'
                  if(allSupp[key]['clicked']){
                    html += '<div onclick="selectedSup(event)" class="mob after-select-check"></div>'
                  }else{
                    html += '<div onclick="selectedSup(event)" class="contact-supp mob">בחר</div>'
                  }
                  html += '</div>'
                  html += '</div>'
                  html += "<span style='display:none'>" + allSupp[key].coverphoto1 + "</span>"
                  html += "<span style='display:none'>" + allSupp[key]["for what"] + "</span>"
                  html += "<span style='display:none'>" + allSupp[key].gift + "</span>"
                
              }
            }




          }

          $(".supplier-qan").html(supAmount)
          $("#sup-warp").html(html)
          $(".supplier-name").text(getMySupName)
          let suptext = $(".supplier-name")[0].innerHTML
          if (suptext == "עלות מנה") {

            $(".supplier-name").text("אולם אירועים")
          }
          html = "";
          supAmount = 0



        }
      })
    });

    if (screen.width >= 768) {

      $(".container").addClass("container-with-supps")
    } else {
      $('body').addClass("body-overlay")
    }

    $(".supp-list").addClass("supp-list-active")

    //hide calc
    if ($(".supp-list").hasClass("supp-list-active")) {
      $(".calc").css("display", "none")
    } else {
      $(".calc").css("display", "block")
    }
  })

}


//push to selected sup array
let supARR = []
let singleSup = []
function selectedSup(e) {
  let displayClass = e.target
  if (displayClass.className == "pc after-select-check" || displayClass.className == "mob after-select-check") {
    return false;

  }
  chosedSups++
  if (screen.width >= 768) {
    singleSup = {
      "supName": e.path[2].lastChild.firstChild.innerText,
      "supPrice": lastRG,
      "logo": e.path[1].firstChild.currentSrc,
      "desc": e.path[2].childNodes[1].childNodes[2].innerText,
      "cover": e.path[2].nextSibling.innerText,
      "gift": e.path[2].nextSibling.nextSibling.innerText,
      "forWhat": e.path[2].nextSibling.nextSibling.nextSibling.innerText
    }
  } else {
    singleSup = {
      "supName": e.path[2].lastChild.firstChild.innerText,
      "supPrice": lastRG,
      "logo": e.path[2].firstChild.firstChild.currentSrc,
      "desc": e.path[2].childNodes[1].childNodes[2].innerText,
      "cover": e.path[2].nextSibling.innerText,
      "gift": e.path[2].nextSibling.nextSibling.innerText,
      "forWhat": e.path[2].nextSibling.nextSibling.nextSibling.innerText
    }
  }
  supARR.push(singleSup)

  $(displayClass).addClass("after-select-check").removeClass("contact-supp").text("")
  $("#my-selected-supps").html(chosedSups)

}


//push to database
function createRecord(e) {

  auth.onAuthStateChanged((user) => {
    if (user) {

      if (supARR.length == 0) {
        alert("לא נבחרו ספקים")
      } else {
        dataBase.ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).once('value').then(function (snapshotor) {
          let updateUser = snapshotor.val();
          if(updateUser == ""){

          }else{
            for(let key in updateUser){
              supARR.push(updateUser[key])
            }
            console.log(supARR)
          }
          
        firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).set(supARR).then(function (snap) {
          reloadCalc()
          slideNextSup()
        });
      })
      }

    }
  });
}
//edit sup qunatity choosed by user
function editRecord(event) {
  let removeSup = event.path[2].lastChild.firstChild.innerText
  let hideDiv = $(event.path[2])
  let editedSups = []
  auth.onAuthStateChanged(function (user) {
    firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).once('value').then(function (snap) {
      let ary = snap.val();
      let aryWithoutSeven = ary.filter(function (value) { return value.supName != removeSup });
      if (aryWithoutSeven == "") {
        firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).set("").then(function (snap) {
          hideDiv.css("display", "none")
          
          reloadCalc()
        });
      } else {
        firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).set(aryWithoutSeven).then(function (snap) {
          hideDiv.css("display", "none")
          
          reloadCalc()
        });
      }

    })
  })

}
//go next sup
function slideNextSup() {
  $(".supp-list").removeClass("supp-list-active")
  $(".container").removeClass("container-with-supps")

  if (getSelectedSupSibling.length) {
    let top = getSelectedSupSibling.offset().top;
    $('html,body').animate({ scrollTop: top - 50 }, 1000);

    chosedSups = 0;
    $("#my-selected-supps").html(chosedSups)
    $("#sup-mob-left").trigger("click")
  }
}
// finish contract with selected supp

let contractName
let contractLogo
let contractDesc
let contractCover
let contractGift
let contractForWhat
function contract(event) {
  contractName = event.path[2].lastChild.firstChild.innerText
  contractLogo = event.path[2].childNodes[0].childNodes[0].currentSrc
  contractDesc = event.path[2].childNodes[1].childNodes[2].innerText
  contractCover = event.path[2].nextSibling.innerText,
    contractGift = event.path[2].nextSibling.nextSibling.innerText,
    contractForWhat = event.path[2].nextSibling.nextSibling.nextSibling.innerText


  $("#end-order").fadeIn()
}

//set contract
$("#save").click(function () {
  let cta = $(this)
  auth.onAuthStateChanged((user) => {
    if ($("#contract-price").val() == "") {
      $("#contract-price").addClass("invalid")

    } else {


      if (screen.width >= 768) {
        Contract = {
          "contractName": contractName,
          "price": $("#contract-price").val(),
          "logo": contractLogo,
          "desc": contractDesc,
          "cover": contractCover,
          "gift": contractGift,
          "forWhat": contractForWhat
        }
      } else {
        Contract = {
          "contractName": contractName,
          "price": $("#contract-price").val(),
          "logo": contractLogo,
          "desc": contractDesc,
          "cover": contractCover,
          "gift": contractGift,
          "forWhat": contractForWhat
        }
      }


      dataBase.ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup + "/contract/").set(Contract).then(function (snap) {
        let top = getSelectedSupSibling.offset().top;
        $('html,body').animate({ scrollTop: top }, 1000);
        $(".container").removeClass("container-with-supps")
        cta.text("!מזל טוב, סגרתם חוזה")
        setTimeout(function () {
          $("#end-order").fadeOut()
          $("#sup-mob-left").trigger("click")
        }, 500);
        $("#" + getSelectedSupParent + " #" + getSelectedSupID).attr('disabled', 'disabled');
        $("#" + getSelectedSupParent + " #" + getSelectedSupID).parent().children(2).children(1).children(1).text($("#contract-price").val())
        $("#" + getSelectedSupParent + " #" + getSelectedSupID).attr('value', $("#contract-price").val());
        reloadCalc()
        setTimeout(function () {
          cta.text("שמור")
          $("#contract-price").val("")
        }, 3000);
      })
    }

  });
})

//cancel contract
function cancelContract(event) {
  $(event).unbind("click", cancelContract);
  auth.onAuthStateChanged(function (user) {
    firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup + "/contract/").set(null).then(function (snap) {
      alert("חוזה בוטל")
      location.reload()
    })
  })
}
$(".close-contract").click(function () {
  $("#end-order").fadeOut()
})


// close mobile sup list
$("#sup-mob-left").click(function () {
  $(".supp-list").removeClass("supp-list-active")
  $('body').removeClass("body-overlay")
})

window.addEventListener("scroll", function () {
  //reset array if slider changed


  let nav1 = $("#nav-hall"),
    nav2 = $("#nav-photography"),
    nav3 = $("#nav-music"),
    nav4 = $("#nav-extra"),
    nav5 = $("#nav-groom"),
    nav6 = $("#nav-bride"),
    nav7 = $("#nav-prepare"),
    navText,
    windowH = window.pageYOffset;
  if (windowH + 50 > nav1.offset().top) {
    navText = nav1.text()
    $("#nav li").removeClass("selected-category")
    $("#nav li:nth-child(1)").addClass("selected-category")
    $("#nav li span").removeClass("selected").addClass("unselected")
    $("#nav li:nth-child(1) span").addClass("selected").removeClass("unselected")
    $('body').css("background", "#f6d365")
  }
  if (windowH + 50 > nav2.offset().top) {
    navText = nav2.text()
    $("#nav li").removeClass("selected-category")
    $("#nav li:nth-child(2)").addClass("selected-category")
    $("#nav li span").removeClass("selected").addClass("unselected")
    $("#nav li:nth-child(2) span").addClass("selected").removeClass("unselected")
    $('body').css("background", "pink")
  }
  if (windowH + 50 > nav3.offset().top) {
    navText = nav3.text()
    $("#nav li").removeClass("selected-category")
    $("#nav li:nth-child(3)").addClass("selected-category")
    $("#nav li span").removeClass("selected").addClass("unselected")
    $("#nav li:nth-child(3) span").addClass("selected").removeClass("unselected")
    $('body').css("background", "gray")
  }
  if (windowH + 50 > nav4.offset().top) {
    navText = nav4.text()
    $("#nav li").removeClass("selected-category")
    $("#nav li:nth-child(4)").addClass("selected-category")
    $("#nav li span").removeClass("selected").addClass("unselected")
    $("#nav li:nth-child(4) span").addClass("selected").removeClass("unselected")
    $('body').css("background", "#79fc7a")
  }
  if (windowH + 50 > nav5.offset().top) {
    navText = nav5.text()
    $("#nav li").removeClass("selected-category")
    $("#nav li:nth-child(5)").addClass("selected-category")
    $("#nav li span").removeClass("selected").addClass("unselected")
    $("#nav li:nth-child(5) span").addClass("selected").removeClass("unselected")
    $('body').css("background", "#46b0e7")
  }
  if (windowH + 50 > nav6.offset().top) {
    navText = nav6.text()
    $("#nav li").removeClass("selected-category")
    $("#nav li:nth-child(6)").addClass("selected-category")
    $("#nav li span").removeClass("selected").addClass("unselected")
    $("#nav li:nth-child(6) span").addClass("selected").removeClass("unselected")
    $('body').css("background", "#7846e7")
  }
  if (windowH + 50 > nav7.offset().top) {
    navText = nav7.text()
    $("#nav li").removeClass("selected-category")
    $("#nav li:nth-child(7)").addClass("selected-category")
    $("#nav li span").removeClass("selected").addClass("unselected")
    $("#nav li:nth-child(7) span").addClass("selected").removeClass("unselected")
    $('body').css("background", "#e7468d")
  }

  $("#head-line-nav").text(navText)
})


//smoth scrool animate + handle links with @href started with '#' only
$(document).on('click', '#nav ul li', function (e) {
  let id = $(this).find("a").attr("href")
  let $id = $(id);
  if ($id.length === 0) {
    return;
  }
  e.preventDefault();
  let pos = $id.offset().top;
  $('body, html').animate({ scrollTop: pos });
});


// get min-max val & lock slider if contract
$(".form-control").each(function (element) {
  $(this).parent().click(function () {
    $(this).children(3).trigger("change")
  })
  let SupID = $(this).attr("id")
  let SupParent = $(this.offsetParent).attr("id")

  dataBase.ref('supliers/' + SupParent).once('value').then(function (snapshotor) {

    let priceList = [];
    let price;
    for (let key in snapshotor.val()) {
      price = snapshotor.val()[key].price
      priceList.push(price)

    }

    let sortArr = priceList.sort(function (a, b) { return a - b })
    let uniquePrice = [];
    $.each(sortArr, function (i, el) {
      if ($.inArray(el, uniquePrice) === -1) uniquePrice.push(el);
    });


    let LowValInARR = uniquePrice[0];
    let BigValInARR = uniquePrice.pop();
    let mySup = $("#" + SupParent + " #" + SupID)

    mySup.attr("min", LowValInARR)
    mySup.attr("max", BigValInARR)
    if (LowValInARR >= 3000) {
      mySup.attr("step", "100")
    } else if (LowValInARR >= 1000) {
      mySup.attr("step", "50")
    } else {
      mySup.attr("step", "5")
    }

    $("#" + SupParent + " .min").html(LowValInARR)
    $("#" + SupParent + " .max").html(BigValInARR)


    //disable & set price if has contract
    auth.onAuthStateChanged(function (user) {
      dataBase.ref('users/' + user.uid + "/CurrentWed/" + SupID).once('value').then(function (snap) {
        if ([Object.keys(snap.val())[Object.keys(snap.val()).length - 1]] == "contract") {
          mySup.parent().children(2).children(1).children(1).text(snap.val().contract.price)
          mySup.val(snap.val().contract.price);
          mySup.attr('disabled', 'disabled');
          mySup.css('cursor', 'disabled');
        } else {
          mySup.attr('enable', 'enable');
        }
      })
    })



    if (snapshotor.val() == 0) {
      $("#" + SupParent).addClass("close-sup")

    }

    $("#home-loader").css("display", "none")
    reloadCalc()
  })
});


//close sup function
$(".xClose").click(function (e) {
  $(this).parent().toggleClass("close-sup")

})



/* calc functions */
// get contract price

function reloadCalc(){
  let totalSupSum = [] ;
  let totalContractSum  = []
  let totalSup = 0;
  let totalCon = 0;
  $(".inside-middle-calc").each(function (element) {
    let GetContractPrice = $(this).attr("id").split("-")[1]

    let rightC =   $(this).parent().parent().children(2)[1]
    let leftC =  $(this).parent().parent().children(2)[3] 

    let rightCalc = $(rightC)
    let leftCalc = $(leftC)
    
    let supPrice = "";
    let conPrice = "";
  
    auth.onAuthStateChanged(function (user) {
      dataBase.ref('users/' + user.uid + "/CurrentWed/" + GetContractPrice).once('value').then(function (snap) {
      //  console.log(snap.val())
  
        if (snap.val().length == 0) {
          rightCalc.html("<a class='go-sup' onclick='supNav(event)'>בחר ספק</a>")
          leftCalc.html("<span class='border'>עדיין לא סגרתם חוזה</span>")
        } else if (snap.val().contract != undefined) {
          totalSupSum.push(snap.val()[0].supPrice)
          totalContractSum.push(snap.val().contract.price)
          rightCalc.html("<span class='border'>₪" + snap.val()[0].supPrice + "</span>")
          leftCalc.html("<span class='border'>₪" + snap.val().contract.price + "</span>")
        } else {
          totalSupSum.push(snap.val()[0].supPrice)
          rightCalc.html("<span class='border'>₪" + snap.val()[0].supPrice + "</span>")
          leftCalc.html("<span class='border'>עדיין לא סגרתם חוזה</span>")
        }
      })

    })
   
  
  })
  calcSum(totalSup,totalCon,totalSupSum,totalContractSum)
  
}
function calcSum(totalSup,totalCon,totalSupSum,totalContractSum){
  
  setTimeout(function() {
    for(let i=0;i<totalSupSum.length;i++){
      totalSup += parseInt(totalSupSum[i])
      
    }
   
    for(let i=0;i<totalContractSum.length;i++){
      totalCon += parseInt(totalContractSum[i])
      
    }
    
    $({countNum: $('#highlight-price').text()}).animate({countNum: totalSup}, {
      duration: 2000,
      easing:'linear',
      step: function() {
        $('#highlight-price').text(Math.floor(this.countNum));
      },
      complete: function() {
        $('#highlight-price').text(this.countNum);

      }
    });
    $({countSup: $('#highlight-last-price').text()}).animate({countSup: totalCon}, {
      duration: 2000,
      easing:'linear',
      step: function() {
        $('#highlight-last-price').text(Math.floor(this.countSup));
      },
      complete: function() {
        $('#highlight-last-price').text(this.countSup);

      }
    });
   // $("#highlight-price").text(totalSup)
  //  $("#highlight-last-price").text(totalCon)
  }, 1000);
  
}




// arrow clicked
$("#arrow-calc img").click(function () {
  $(".calc").toggleClass("calc-open")
  $('body').toggleClass("body-overlay")
})


//nav to selected supp
function supNav(e) {
  $('body').removeClass("body-overlay")
  let sup = e.path[2].childNodes[5].childNodes[1]
  let getSplitedName = $(sup).attr("id").split("-")[1]
  let supOffSet = $("#" + getSplitedName).offset().top
  $(".calc").removeClass("calc-open")
  $('html,body').animate({ scrollTop: supOffSet - 150 }, 1000);
}




