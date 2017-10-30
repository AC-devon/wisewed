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
                    $("#user-name").text(user.val().display)
                })

                // get suppliers data on page
                let supKind = window.location.hash.split("#")[1]
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

                // stop loader
                $("#home-loader").css("display", "none")
            } else {
                window.location.href = parPage;
            }
        });

    
    
    });


    function supLogic(supplier){

        let supCover1 = supplier.coverphoto1;
        let supCover2 = supplier.coverphoto2;
        let imageSlider = [supCover1,supCover2]
        let sliderTag = ""

        imageSlider.forEach(function(element) {
            sliderTag += "<figure><img src="+element+" alt> </figure>"  
        }, this);
        $(".slider").html(sliderTag)
        
    }