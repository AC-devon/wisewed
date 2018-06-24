

function mailer(suppliers) {
    $("#submit-all-supp").addClass("mail-loader")

    visibleNotification()
    


        function visibleNotification(){
            $("#submit-all-supp").addClass("mail-loader-end")
            setTimeout(() => {
                $("#mail-send-update").addClass("mail-send-update-visible")
            }, 2500);
           
        }
      let userInfo = ""
    
    }