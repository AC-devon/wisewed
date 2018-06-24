$(document).ready(function () {
    
        let user = auth.currentUser;
        let parPage = "/"
        
        auth.onAuthStateChanged(function (user) {
            if (user) {
                dataBase.ref('users/' + user.uid).once('value').then(function (user) {
                    if (user.val().Photo == "") {
                        $("#user-image").css("background", "gray")
                    } else {
                        $("#user-image").attr("src", user.val().Photo)
                    }
                    if(user.val().Gender == "female"){
                        $("#user-name").text(user.val().WifeName)
                    }else{
                        $("#user-name").text(user.val().HusbandName)
                    }
                    
                    
                })

                // get suppliers data on page
                let supKind = decodeURIComponent(window.location.hash.split("#")[1])
                dataBase.ref('supliers').once('value').then(function (data) {
                    for(let key in data.val()){
                        let supplierType = data.val()[key]
                        for(let selected in supplierType){                 
                           if(supplierType[selected].name == supKind){
                                supLogic(supplierType[selected])                          
                           }
                        }
                    }
                    
                })

               
            } else {
                window.location.href = parPage;
            }
        });

    });


    function supLogic(supplier){
        if(supplier.membership == "silver"){
            $("#gift").css("display","none")
            $("#sup-warp").css("height","auto")
        }
      
        let supName = supplier.name;
        let supDesc = supplier["long description"]
        let supLogo = supplier.logo
        let supCover1 = supplier.coverphoto1;
        let supCover2 = supplier.coverphoto2;
        let imageSlider = [supCover1,supCover2]
        let supPrice = supplier.price;
        let supGift = supplier.gift
        let forWhat = supplier["for what"]
        
        //gift data
        $("#box-head span").text("₪"+supPrice)
        $("#for-what").text(forWhat)
        $("#gift-text").text(supGift)


        // context data
        $("#sup-name").text(supName)
        $("#sup-logo img").attr("src",supLogo)
        $("#sup-desc").text(supDesc)
        
        //images data
        $("#slider #cover1").attr("src",imageSlider[0])
        $("#slider #cover2").attr("src",imageSlider[1])
        
         // stop loader
        setTimeout(function() {
            $("#home-loader").css("display", "none")
        }, 2000);
        
        $('#slider').slick({
            autoplay: true,
        });
    }

    // $().click(function () {

    // })