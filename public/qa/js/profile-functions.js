//every refresh will scrool to top
$('body, html').animate({ scrollTop: 0 });
$("#user-image").click(function(){
  $("#user-menu").slideToggle("fast");
});

//log off func
const logout = document.getElementById('log-out')
logout.addEventListener('click', e => {
  auth.signOut();
});

 
// select sup slider 
let selected
let activeClass
let getSelectedSupID
let getSelectedSupParent
let getSelectedSupSibling
let getMySupName
let lastSupId = getSelectedSupID
let sliderVal;
$(".form-control").change(function (e) {
  

  $(this.offsetParent).trigger('mouseenter');
  getSelectedSupID = $(this).attr("id")
  getSelectedSupParent = $(this.offsetParent).attr("id")
  getMySupName = $(this).parent().find("span")[0].innerText
  mySlider(getSelectedSupID, getSelectedSupParent)
  $("#loader").css("display", "block");
  calcToggle();
  let id = $(this.offsetParent)
  let pos = id.offset().top;
  $('body, html').animate({ scrollTop: pos - 50 });

  if (typeof lastSupId == 'undefined') {
    lastSupId = getSelectedSupID
    supARR = []
    newSup = []
    return false
  }

  if (lastSupId != getSelectedSupID) {

    lastSupId = getSelectedSupID
    supARR = []
    newSup = []
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

//slider function
let allSupp
let mySupp;
function mySlider(getSelectedSupID, getSelectedSupParent) {
  auth.onAuthStateChanged(function (user) {
    let html = "";
    let rg = $("#"+getSelectedSupParent +" .last-price").text()
    lastRG = rg
    lastSelectedSup = getSelectedSupID
   
    dataBase.ref('users/' + user.uid).once('value').then(function (snapshot) {
      mySupp = snapshot.child('CurrentWed').child(getSelectedSupID).val();
      dataBase.ref('supliers/' + getSelectedSupParent).once('value').then(function (snapshotor) {
        allSupp = snapshotor.val()
        if (mySupp == '') {
          $("#loader,#suppliers-choosed,#contract-on,#go-next-supp,.extra-sup").css("display", "none");
          $("#suppliers-on").css("display", "block");
          $("#submit-supp").css("background","#e84b41")
          $("#submit-all-supp,#selected-supps").css("display", "inline-block");
          loadSup(allSupp)


          $(".supplier-qan").html(supAmount)
          
          $(".supplier-name").text(getMySupName)
          let suptext = $(".supplier-name")[0].innerHTML
          if (suptext == "עלות מנה") {

            $(".supplier-name").text("אולם אירועים")
          }
          html = "";
          supAmount = 0




        } else {
          

          if ([Object.keys(mySupp)[Object.keys(mySupp).length - 1]] == "contract") {

            $("#loader,#suppliers-on,#suppliers-choosed,#submit-all-supp,#selected-supps,.extra-sup").css("display", "none");
            $("#contract-on,#go-next-supp").css("display", "block");
            $("#submit-supp").css("background","white")
            $("#go-next-supp").css("display", "inline-block");
            html += '<div class="sup sup-contract-end" data-supplier="'+ mySupp.contract.contractName+'">'
            html += '<div class="sup-img-contract"><img src="' + mySupp.contract.cover + '"/>'
            html += '</div>'
            html += '<div class="warp-text-contract" data-supplier="'+mySupp.contract.contractName+'">'
            html += '<div class="right-text-contract inline-block"><span id="warp-logo"><img id="contract-logo" src="' + mySupp.contract.logo + '"/></span><div id="contract-name-in">' + mySupp.contract.contractName + '<img class="star-img" src="images/stars.png"></span></div></div>'
            html += '<div class="left-text-contract inline-block"><div id="red-contract-price">₪' + mySupp.contract.price + '</div>לאירוע</div>'
            html += '</div>'
            html += '<div class="sup-contract-details">'
            html += '<h4 class="bold text-right">פרטי הספק</h4>'
            html += '<div class="text-right" id="for-what-contract">' + mySupp.contract.forWhat + '</div>'
            html += '<br><div class="bold text-right" id="gift-content">הטבה מ-<span class="wisewed-red">Wisewed</span></div>'
            html += '<div class="text-right" id="gift-contract">' + mySupp.contract.gift + '</div>'
            html += '</div>'
            html += '<div id="bottom-contract"><div class="recomand contract-end">כתוב המלצה</div>'
            html += '<div class="cancel-contracts"><div onclick="cancelContract(this)" id="cacnel-cta">החוזה בוטל</div></div></div>'
            html += '</div>'
            html += '</div>'
          } else {
            for (let i = 0; i < Object.keys(mySupp).length; i++) {
              supAmount++
              
              $("#loader,#suppliers-on,#contract-on,#go-next-supp").css("display", "none");
              $("#suppliers-choosed,.extra-sup").css("display", "block");
              $("#submit-supp").css("background","#e84b41")
              $("#submit-all-supp,#selected-supps").css("display", "inline-block");
              html += '<div class="sup sup-contract" data-supplier="'+mySupp[i].supName+'">'
              html += '<div class="sup-img inline-block">'
              html += '<img src=' + mySupp[i].logo + ' class="sup-image-class">'
              html += '<div onclick="contract(this)" class=" contract-end pc">סגרנו חוזה</div>'
              html += '<div onclick="editRecord(this)"  class="remove-from-contracts pc">הסר מהרשימה</div>'
              html += '</div>'
              html += '<div class="sup-text text-justify inline-block">'
              html += '<a href="/qa/supplier.html#' + mySupp[i].supName + '"  target="_blank" id="' + [i] + '" class="a main-text text-right">' + mySupp[i].supName + '</a>'
              html += '<img src="images/stars.png" class="star-img sup-text-class">'
              html += '<p class="p-text">' + mySupp[i].desc.split('  ').join(' ').substring(0, 90) + '</p>'
              html += '<div onclick="contract(this)" class="contract-end mob">סגרנו חוזה</div>'
              html += '<div onclick="editRecord(this)" class="remove-from-contracts mob">הסר מהרשימה</div>'
              html += '</div>'
              html += '</div>'
            }
            html += '<div id="extra-sup"><p>ספקים נוספים בתחום</p><div class="mob" id="more-sup-icon"><i class="fa fa-angle-left" aria-hidden="true"></i></div></div>'
           
               //remove double supps from allsupps array
               let supClicked = {"clicked" : true}    
               for(let i=0;i<mySupp.length;i++){
                 for(let key in allSupp){
                   if (mySupp[i].supName === allSupp[key].name){
                     delete allSupp[key]
                                       
                   }
                 }
               }
            for (let key in allSupp) {
              let fivePresentUP = allSupp[key].price * 1.05
              //let fivePresentBottom = allSupp[key].price * .95
              let supClicked = {"clicked" : true}
          
              if (parseInt(lastRG) <= parseInt(fivePresentUP) && parseInt(lastRG) >= parseInt(allSupp[key].price)) {       
                html += '<div class="sup" data-supplier="'+key+'">'
                html += '<div class="sup-img inline-block">'
            
                html += '<img src=' + allSupp[key].logo + ' class="sup-image-class">'
                if(allSupp[key]['clicked']){
                  html += '<div onclick="selectedSup(this)" class="pc after-select-check">צור קשר </div>'
                }else{
                  html += '<div onclick="selectedSup(this)" class="contact-supp pc"></span>צור קשר</div>'
                }
                
                html += '</div>'
                html += '<div class="sup-text text-justify inline-block">'
                html += '<a href="/qa/supplier.html#' + allSupp[key].name + '" target="_blank" id="' + [key] + '" class="a main-text text-right">' + allSupp[key].name + '</a>'
                html += '<img src="images/stars.png"  class="star-img sup-text-class">'
                html += '<p class="p-text">' + allSupp[key]["long description"].split('  ').join(' ').substring(0, 90) + '</p>'
                if(allSupp[key]['clicked']){
                  html += '<div onclick="selectedSup(this)" class="mob after-select-check"></div>'
                }else{
                  html += '<div onclick="selectedSup(this)" class="contact-supp mob">בחר</div>'
                }
                
                html += '</div>'
                html += '</div>'
          
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
    calcToggle();
  })
 
}

function loadSup(suppliers){
  let html = "";
  

  for (let key in suppliers) {
    let fivePresentUP = suppliers[key].price * 1.05
    //let fivePresentBottom = allSupp[key].price * .95
    let supClicked = {"clicked" : true}

           //remove double supps from allsupps array
           for(let i=0;i<supARR.length;i++){
            for(let key in suppliers){
              if (supARR[i].supName === suppliers[key].name){
        
                suppliers[key]['clicked'] = true;  
                       
              }
            }
          }
    if (parseInt(lastRG) <= parseInt(fivePresentUP) && parseInt(lastRG) >= parseInt(suppliers[key].price)) {

      supAmount++

      html += '<div class="sup" data-supplier="'+key+'">'
      html += '<div class="sup-img inline-block">'
  
      html += '<img src=' + suppliers[key].logo + ' class="sup-image-class">'
      if(suppliers[key]['clicked']){
        html += '<div onclick="selectedSup(this)" class="pc after-select-check">צור קשר </div>'
      }else{
        html += '<div onclick="selectedSup(this)" class="contact-supp pc"></span>צור קשר</div>'
      }
      
      html += '</div>'
      html += '<div class="sup-text text-justify inline-block">'
      html += '<a href="/qa/supplier.html#' + suppliers[key].name + '" target="_blank" id="' + [key] + '" class="a main-text text-right">' + suppliers[key].name + '</a>'
      html += '<img src="images/stars.png"  class="star-img sup-text-class">'
      html += '<p class="p-text">' + suppliers[key]["long description"].split('  ').join(' ').substring(0, 90) + '</p>'
      if(suppliers[key]['clicked']){
        html += '<div onclick="selectedSup(this)" class="mob after-select-check"></div>'
      }else{
        html += '<div onclick="selectedSup(this)" class="contact-supp mob">בחר</div>'
      }
      
      html += '</div>'
      html += '</div>'

    }
  }

  $("#sup-warp").html(html)

}
//push to selected sup array
let supARR = []
let newSup = []

function selectedSup(e) {
  let selectedSupplier = {}
  let targetSup = e
  let displayClass = $(e).attr('class')
  let dataAttr = $(e).parent().parent().data().supplier.trim() 

  if (targetSup.className == "pc after-select-check" || targetSup.className == "mob after-select-check") {
    chosedSups--
    $(targetSup).addClass("contact-supp").removeClass("after-select-check")

    newSup = newSup.filter(e => e.supName.trim() !== dataAttr);

    $("#my-selected-supps").html(chosedSups)
    
  }else{

        matchSup(allSupp,dataAttr,newSup,"post")
     
    chosedSups++
    $(targetSup).addClass("after-select-check").removeClass("contact-supp")
    $("#my-selected-supps").html(chosedSups)
  }
  supARR = newSup

}
 
function matchSup(ArrList,dataAttr,pushArr,action){
  let selectedSupplier;
  let filterSup
 
  for (let item in ArrList) {
   
    if (dataAttr == ArrList[item].name.trim()) {
      filterSup = ArrList[item]
      switch (action) {
        case "post":
       
          push(filterSup)
          break;
        case "update":
          update()
          break;
        case "remove":
          remove()
          break
          default:
          
      }
    }
  }
  function push(filterSup){

    selectedSupplier = {
      "supName": filterSup.name,
      "supPrice": lastRG,
      "logo": filterSup.logo,
      "desc": filterSup["long description"],
      "cover": filterSup.coverphoto1,
      "gift": filterSup.gift,
      "forWhat": filterSup["for what"]
    }

      pushArr.push(selectedSupplier)
    
  }
}

//push to database
function createRecord(e) {

  auth.onAuthStateChanged((user) => {
    if (user) {
 
      if (newSup.length == 0) {
        alert("לא נבחרו ספקים")
      } else {
        dataBase.ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).once('value').then(function (snapshotor) {
          let updateARR = snapshotor.val();
          if(updateARR == ""){
            supARR = newSup
          }else{
  
              supARR = updateARR.concat(newSup);
          }
         
 
        firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).set(supARR).then(function (snap) {
          reloadCalc()
         mailer(newSup)
        newSup = []
        supARR = []
        });
      })
      }
 
    }
  });
}
//edit sup qunatity choosed by user
function editRecord(event) {
  let removeSup = $(event).parent().parent().data().supplier.trim();
  let hideDiv =  $(event).parent().parent()
  auth.onAuthStateChanged(function (user) {
    firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).once('value').then(function (snap) {
      let ary = snap.val();
      let filterdArr = ary.filter(function (value) { return value.supName.trim() != removeSup });
     
      if (filterdArr == "") {
        firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).set("").then(function (snap) {
          hideDiv.css("display", "none")
          
          reloadCalc()
        });
      } else {
        firebase.database().ref('users/' + user.uid + "/CurrentWed/" + lastSelectedSup).set(filterdArr).then(function (snap) {
          hideDiv.css("display", "none")
          
          reloadCalc()
        });
      }

    })
  })

}
// finish contract with selected supp


function contract(event) {
  selDataAttr = $(event).parent().parent().data().supplier.trim();
  $("#end-order").fadeIn()
}

//set contract
$("#save").click(function () {
 dataBase.ref('supliers/' + getSelectedSupParent).once('value').then(function (snapshotor) {
  let Suplist = snapshotor.val()
  
 
  let Contract
  let cta = $(this)
  auth.onAuthStateChanged((user) => {
    if ($("#contract-price").val() == "" || $("#contract-price").val() <= 0 ) {
      $("#contract-price").addClass("invalid")

    } else {
      for (let item in Suplist) {  
   
         if (selDataAttr == Suplist[item].name.trim()) {
       Contract = {
        "contractName": Suplist[item].name,
        "price": $("#contract-price").val(),
        "logo": Suplist[item].logo,
        "desc": Suplist[item]["long description"],
        "cover": Suplist[item].coverphoto1,
        "gift": Suplist[item].gift,
        "forWhat": Suplist[item]["for what"]
      }

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
})


//go next sup
function slideNextSup() {
  $(".supp-list").removeClass("supp-list-active")
  $(".container").removeClass("container-with-supps")
  $("#submit-all-supp").removeClass("mail-loader").removeClass("mail-loader-end")
  $("#mail-send-update").removeClass("mail-send-update-visible")
  if (getSelectedSupSibling.length) {
    
    let top = getSelectedSupSibling.offset().top;
    $('html,body').animate({ scrollTop: top - 50 }, 1000);

    chosedSups = 0;
    $("#my-selected-supps").html(chosedSups)
    $("#sup-mob-left").trigger("click")
  }
}


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


// close sup list
$("#sup-mob-left,.close-sup-pc").click(function () {
  $(".container").removeClass("container-with-supps")
  $(".supp-list").removeClass("supp-list-active")
  $("#submit-all-supp").removeClass("mail-loader").removeClass("mail-loader-end")
  $("#mail-send-update").removeClass("mail-send-update-visible")
  $('body').removeClass("body-overlay")
  calcToggle();
})
function menu(navID,navNum,bgColor){
  
   $("#head-line-nav").text(navID.text())
   $("#nav li").removeClass("selected-category")
   $("#nav li span").removeClass("selected").addClass("unselected")
   $("#nav li:nth-child("+navNum+")").addClass("selected-category") 
   $("#nav li:nth-child("+navNum+") span").addClass("selected").removeClass("unselected")
   $("body").css("background",bgColor);
 }
  
 window.addEventListener("scroll", function () {
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
   menu( nav1,1,"linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)")
   }
   if (windowH + 50 > nav2.offset().top) {
     menu( nav2,2,"linear-gradient(to top, #a18cd1 0%, #fbc2eb 100%)")
   }
   if (windowH + 50 > nav3.offset().top) {
     menu( nav3,3,"linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)")
   }
   if (windowH + 50 > nav4.offset().top) {
     menu( nav4,4,"linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)")
   }
   if (windowH + 50 > nav5.offset().top) {
     menu( nav5,5,"linear-gradient(to top, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%)")
   }
   if (windowH + 50 > nav6.offset().top) {
     menu( nav6,6,"linear-gradient(to top, #a8edea 0%, #fed6e3 100%)") 
   }
   if (windowH + 50 > nav7.offset().top) {
     menu( nav7,7,"linear-gradient(to top, #d299c2 0%, #fef9d7 100%)")
   }
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
 
  $(this).parent().click(function (e) {
    let clickedSup =  e.target.className
    if( clickedSup != "xClose" && clickedSup != "details"){
      $(this).children(3).trigger("change")
      $("#submit-all-supp").removeClass("mail-loader").removeClass("mail-loader-end")
      $("#mail-send-update").removeClass("mail-send-update-visible")
    }
  })
  let SupID = $(this).attr("id")
  let SupParent = $(this.offsetParent).attr("id")

  dataBase.ref('supliers/' + SupParent).once('value').then(function (snapshotor) {

    let priceList = [];
    let price;
    for (let key in snapshotor.val()) {
      price = snapshotor.val()[key].price
      priceList.push(snapshotor.val()[key].price)

    }

    let sortArr = priceList.sort(function (a, b) { return a - b })
    let uniquePrice = [];
    $.each(sortArr, function (i, el) {
      if ($.inArray(el, uniquePrice) === -1) uniquePrice.push(el);
    });


    let LowValInARR = uniquePrice[0];
    let BigValInARR = uniquePrice[uniquePrice.length -1];
    let mySup = $("#" + SupParent + " #" + SupID)
    
    mySup.attr("min", 0)
    mySup.attr("max", uniquePrice.length -1 )
    mySup.attr("value", 0 )
    $("#"+SupParent+ " .last-price").text(uniquePrice[0])

    mySup.on("input",function () {
      let sliderInput = mySup;
      sliderVal = ($(sliderInput).val() - $(sliderInput).attr('min')) / ($(sliderInput).attr('max') - $(sliderInput).attr('min'));
      $(sliderInput).css('background',
      '-webkit-gradient(linear, left top, right top, '
      + 'color-stop(' + sliderVal + ', #e74b46), '
      + 'color-stop(' + sliderVal + ', #e0e0e0)'
      + ')'
      );

      $("#"+SupParent+ " .last-price").text(uniquePrice[this.value]) ;
     
    })


    $("#" + SupParent + " .min").html(LowValInARR)
    $("#" + SupParent + " .max").html(BigValInARR)

    //disable & set price if has contract
    auth.onAuthStateChanged(function (user) {
      dataBase.ref('users/' + user.uid + "/CurrentWed/" + SupID).once('value').then(function (snap) {
        if ([Object.keys(snap.val())[Object.keys(snap.val()).length - 1]] == "contract") {
          mySup.parent().children(2).children(1).children(1).text(snap.val().contract.price)
          mySup.val(uniquePrice.findIndex(findFirstLargeNumber));
          mySup.attr('disabled', 'disabled');
          mySup.css('cursor', 'disabled');

        function findFirstLargeNumber(element) {
          return element > snap.val().contract.price;
        }
        
        let sliderInput = mySup;
      sliderVal = (uniquePrice.findIndex(findFirstLargeNumber) - $(sliderInput).attr('min')) / ($(sliderInput).attr('max') - $(sliderInput).attr('min'));
      $(sliderInput).css('background',
      '-webkit-gradient(linear, left top, right top, '
      + 'color-stop(' + sliderVal + ', #e74b46), '
      + 'color-stop(' + sliderVal + ', #e0e0e0)'
      + ')'
      );
        
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
function calcToggle(){

    if ($(".supp-list").hasClass("supp-list-active")) {
        $(".calc").css("bottom", "-200px")
       if(window.innerWidth < 765){
         $("#user").css("left","-21%")
       }
    } else {
        $(".calc").css("bottom", "0px")
        if(window.innerWidth < 765){
          $("#user").css("left","7%")
        }
    }
 
}
//segmeted hide calc



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
let CalcGuest;
let Calchall = 0;
let contractHallCalc =0;
let alcoholCalc = 0;
let contractalcoholCalc = 0;

function handleCalc(){
  let user = auth.currentUser;
  auth.onAuthStateChanged(function (user) {
      dataBase.ref('users/' + user.uid).once('value').then(function (data) {
        CalcGuest = data.val().Guest
        let Hallarr = Object.keys(data.val().CurrentWed.hall).map(function (key) { return data.val().CurrentWed.hall[key]; });
        let alcarr = Object.keys(data.val().CurrentWed.alc).map(function (key) { return data.val().CurrentWed.alc[key]; });

       
    
        for(let key in alcarr){
          if(alcarr[key].contractName != undefined){
            contractalcoholCalc  = alcarr[key].price * CalcGuest
          }
        }
        for(let key in Hallarr){
          if(Hallarr[key].contractName != undefined){
            contractHallCalc  = Hallarr[key].price * CalcGuest
          }
        }
        Calchall = Hallarr[0].supPrice * CalcGuest;
        alcoholCalc = alcarr[0].supPrice * CalcGuest;
      })
  })

}

  handleCalc()

  

function calcSum(totalSup,totalCon,totalSupSum,totalContractSum){
  
  handleCalc()
 
  setTimeout(function() {
    for(let i=0;i<totalSupSum.length;i++){
      totalSup += parseInt(totalSupSum[i])
      
    }
   
    for(let i=0;i<totalContractSum.length;i++){
      totalCon += parseInt(totalContractSum[i])
      
    }
    let totalAfter = Math.ceil((Calchall + totalSup + alcoholCalc) / CalcGuest )
    //if(hall !=)
    let totalConAfter = Math.ceil((contractHallCalc + totalCon + alcoholCalc) / CalcGuest)
    $({countNum: $('#highlight-price').text()}).animate({countNum: totalAfter}, {
      duration: 1000,
      easing:'linear',
      step: function() {
        $('#highlight-price').text(Math.floor(this.countNum));
      },
      complete: function() {
        $('#highlight-price').text(this.countNum);

      }
    });
    $({countSup: $('#highlight-last-price').text()}).animate({countSup: totalConAfter}, {
      duration: 1000,
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


// hide more-supp toolTip div
let moreSup = document.getElementById("sup-warp")
$("#sup-warp").scroll(function() {
  if(innerWidth < 750){
    if(moreSup.scrollLeft <= 100){
      $("#extra-sup").css("display","none")
      }else{
        $("#extra-sup").css("display","block")
      }
  }


})

