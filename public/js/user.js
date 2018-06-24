

// regex detect
function detectLetter(e){
    
    let regex =  new RegExp("^[a-zA-Z\u0590-\u05fe]+$")
    return regex.test(event.key);
}
$(document).ready(function () {

   
    let user = auth.currentUser;
    let parPage = "/"
    auth.onAuthStateChanged(function (user) {
     
        if (user) {
            // set user data on page
            dataBase.ref('users/' + user.uid).once('value').then(function (user) {
                if (user.val().Gender == "female") {
                    
                    if(user.val().FemalePhoto != ""){
                       
                        $("#user-image-female").attr("src", user.val().FemalePhoto)
                    }else{
                        
                        $("#user-image-female").attr("src", user.val().Photo)
                    }
                   
                }else if(user.val().Gender == "male"){
                    if(user.val().MalePhoto != ""){
                        $("#user-image-male").attr("src", user.val().MalePhoto)
                    }else{
                        $("#user-image-male").attr("src", user.val().Photo)
                    }
                   
                    $("#user-image-male").attr("src", user.val().Photo)
                } 
             


                if(user.val().Gender == "male"){

                    $(".wedder").removeClass("wedder-active")
                    $("#am-groom").addClass("wedder-active")
                    $('#am-groom-input').trigger('click');
                }else{
                    $(".wedder").removeClass("wedder-active")
                    $("#am-bride").addClass("wedder-active").attr("checked","checked")
                    $('#am-bride-input').trigger('click');
                }

                //bride details
                $("#WifeName").val(user.val().WifeName)
                $("#select2-WifeArea-container").text(user.val().WifeArea); 
            

                //groom details
                $("#HusbandName").val(user.val().HusbandName)
                $("#select2-HusbandArea-container").text(user.val().HusbandArea); 
               
                //general details
                $("#Email").val(user.val().Email)
                $("#PhoneNumber").val(user.val().Phone)
                $("#WantedHall").val(user.val().WantedHall)
                $("#WantedArea").val(user.val().WantedArea)                
                $("#date").val(user.val().Date)
                $("#Invites").val(user.val().Guest)
                $("#home-loader").css("display", "none")
            })

            // upload new image
            let fileBtnFemale = document.getElementById("imguploadbride")
            fileBtnFemale.addEventListener("change", function (e) {
                let file = e.target.files[0]
                let imageType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];  

                // Given that file is a file object and file.type is string 
                // like "image/jpeg", "image/png", or "image/gif" and so on...
                
                if (-1 == $.inArray(file.type.split('/')[1], imageType)) {
                  alert('אנא בחר תמונה!');
                  return false
                }
                
               
                let storeageRef = fireStorage.ref('users-image/' + user.uid + '/' + file.name)
                let task = storeageRef.put(file)
                task.on('state_changed',
                    function prograss(snap) {
                        $(".spin-par").css("display", "block")
                        let precetage = (snap.bytesTransferred / snap.totalBytes) * 100
                        console.log(precetage)
                    },
                    function err(err) {
                        console.log(err)
                    },
                    function complete() {
                        dataBase.ref('users/' + user.uid + '/FemalePhoto').set(task.metadata_.downloadURLs[0]).then(function (snap) {
                            dataBase.ref('users/' + user.uid).once('value').then(function (user) {
                                $("#user-image-female").attr("src", task.metadata_.downloadURLs[0])
                            })
                        })
                        $(".spin-par").css("display", "none")
                    }
                )
            })
                     // upload new image
                     let fileBtnMale = document.getElementById("imguploadgroom")
                     fileBtnMale.addEventListener("change", function (e) {
                         let file = e.target.files[0]
                         let imageType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];  

                         // Given that file is a file object and file.type is string 
                         // like "image/jpeg", "image/png", or "image/gif" and so on...
                         
                         if (-1 == $.inArray(file.type.split('/')[1], imageType)) {
                           alert('אנא בחר תמונה!');
                           return false
                         }
                         let storeageRef = fireStorage.ref('users-image/' + user.uid + '/' + file.name)
                         let task = storeageRef.put(file)
                         task.on('state_changed',
                             function prograss(snap) {
                                 $(".spin-par").css("display", "block")
                                 let precetage = (snap.bytesTransferred / snap.totalBytes) * 100
                                 console.log(precetage)
                             },
                             function err(err) {
                                 console.log(err)
                             },
                             function complete() {
                                 dataBase.ref('users/' + user.uid + '/MalePhoto').set(task.metadata_.downloadURLs[0]).then(function (snap) {
                                     dataBase.ref('users/' + user.uid).once('value').then(function (user) {
                                         $("#user-image-male").attr("src", task.metadata_.downloadURLs[0])
                                     })
                                 })
                                 $(".spin-par").css("display", "none")
                                 
                             }
                         )
                     })
        } else {
            window.location.href = parPage;
        }
    });
    $("#icon-bride").click(function () {
        $('#imguploadbride').trigger('click');
    });
    $("#icon-groom").click(function () {
        $('#imguploadgroom').trigger('click');
    });


    $.ajax({
        dataType: "json",
        url: "js/citys.json",
        
        success:  function( data ) {
           let towns = []
            $.each( data, function( key, val ) {
               // console.log(val.name)
                towns.push( val.name);
            });
            $(".citys").select2({
                data: towns,
              });
              setTimeout(() => {
                $(".select2-selection__rendered").text("איזור מגורים")
              }, 2000);
        },
        fail: function () {
            console.log("fail")
        }
      });

 //date picker 
 $("#date").datepicker({
    minDate: 0  
});

/* Hebrew initialisation for the UI Datepicker extension. */
/* Written by Amir Hardon (ahardon at gmail dot com). */
( function( factory ) {
if ( typeof define === "function" && define.amd ) {

// AMD. Register as an anonymous module.
define( [ "../widgets/datepicker" ], factory );
} else {

// Browser globals
factory( jQuery.datepicker );
}
}( function( datepicker ) {

datepicker.regional.he = {
closeText: "סגור",
prevText: "&#x3C;הקודם",
nextText: "הבא&#x3E;",
currentText: "היום",
monthNames: [ "ינואר","פברואר","מרץ","אפריל","מאי","יוני",
"יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר" ],
monthNamesShort: [ "ינו","פבר","מרץ","אפר","מאי","יוני",
"יולי","אוג","ספט","אוק","נוב","דצמ" ],
dayNames: [ "ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת" ],
dayNamesShort: [ "א'","ב'","ג'","ד'","ה'","ו'","שבת" ],
dayNamesMin: [ "א'","ב'","ג'","ד'","ה'","ו'","שבת" ],
weekHeader: "Wk",
dateFormat: "dd/mm/yy",
firstDay: 0,
isRTL: true,
showMonthAfterYear: false,
yearSuffix: "" };
datepicker.setDefaults( datepicker.regional.he );

return datepicker.regional.he;

} ) );
});

function gender(id){
    $(".wedder").removeClass("wedder-active")
    $("#"+id).addClass("wedder-active")
    if(id == "am-bride"){
        
        $('#am-bride-input').trigger('click');
    }else{
        $('#am-groom-input').trigger('click');
    }
 
}

// has wedding date checker
let ignoreDate = false
function weddingDateCheck(e){
    
   if( $("#"+e.target.id).is(":checked") ){    
       $("#date").attr("disabled","disabled").css("opacity","0.5")
        ignoreDate = true
   }else{
       $("#date").attr("disabled", false).css("opacity","1")
       ignoreDate = false
   }
}



// update data
function updateUser(){
    let user = auth.currentUser;
    let WifeName = $("#WifeName");
    let WifeArea = $("#WifeArea");
    let HusbandName = $("#HusbandName");
    let HusbandArea = $("#HusbandArea");
    let Email = $("#Email");
    let PhoneNumber = $("#PhoneNumber");
    let WantedArea = $("#WantedArea");
    let Invites = $("#Invites");
    let MyDate = $("#date");
    let counter = 0;
   

    let MyVar = [WifeName,WifeArea,HusbandName,HusbandArea,Email,PhoneNumber,WantedArea,Invites,MyDate]
    // if(ignoreDate){
    //     MyVar.pop(8)
        
    // }
    // MyVar.forEach(function(vars, index) {
        
    //     if(vars.val() === undefined || vars.val() == ''){
            
    //         $(vars).addClass("input-error input-err")
    //         let PH = $(vars).attr("placeholder")
    //         $(vars).attr("placeholder","*"+PH)
          
    //         $("#forget-alert").css("top","225px")
    //         $('body, html').animate({ scrollTop: $(".inputs-wrap")[0].offsetTop });
    //         return false;
    //     }else{
    //         counter++
    //         $(vars).css("border-bottom","1px solid #b1b1b1")
    //     }
    //     setTimeout(() => {
    //         $(".input-style").removeClass("input-error")
    //         $("#forget-alert").css("top","-100px")
    //     }, 3000);
       
    //   });
    
    //   if(counter == MyVar.length){
    //     updateDB()
    // }
    updateDB()
    function updateDB(){
        auth.onAuthStateChanged(function (user) {
            dataBase.ref('users/' + user.uid).once('value').then(function (data) {
                let updateUser = data.val();
        
                updateUser.WifeName =  WifeName.val()
                updateUser.WifeArea =  WifeArea.val()
        
                updateUser.HusbandName =  HusbandName.val()
                updateUser.HusbandArea =  HusbandArea.val()
                
                updateUser.Email =  Email.val()
                updateUser.Phone =  PhoneNumber.val()
                updateUser.Gender = $("input[type='radio'][name='gender']:checked").val()
                updateUser.WantedHall =  $("#WantedHall").val()
                updateUser.WantedArea =  WantedArea.val()
                updateUser.Date =  MyDate.val();
                updateUser.Guest =  Invites.val();
                //console.log(updateUser)
                dataBase.ref('users/' + user.uid).set(updateUser).then(function (snap) {
                    window.location.href = "/profile.html"
                    })
            })
        })
    }
}
