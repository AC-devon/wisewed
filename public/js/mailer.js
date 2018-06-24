

function mailer(suppliers) {
    $("#submit-all-supp").addClass("mail-loader")

    suppliers.forEach(sup => {
    
      dataBase.ref('supliers').once('value').then(function (data) {
        for(let key in data.val()){
            let supplierType = data.val()[key]
            for(let selected in supplierType){
               if(supplierType[selected].name == sup.supName){
                       let lids = supplierType[selected].lidCounter;
                       let type = supplierType[selected].membership;
                       let supllier = supplierType[selected]
                        console.log(supllier)
                        
                       if(lids == 0 && type == "silver"){
                        silverMail(supllier)
                       }else if(lids >= 1 && type == "silver"){
                        genericMail(supllier)
                       }else{
                        goldMail(supllier)   
                       }     
                       lids++
                       dataBase.ref('supliers/' + getSelectedSupParent + '/' + supllier.name+ '/lidCounter').set(lids).then(function (snap) {
                         
                       });       
               }
            }
        }
        
    })
    
    });
    
    
        function goldMail(sup){
          
          auth.onAuthStateChanged((user) => {
            dataBase.ref('users/' + user.uid ).once('value').then(function (snapshotor) {
               userInfo =  snapshotor.val()
                  emailjs.send("wisewed_support", "wisewed_suppliers", {
                  supplier_email: sup.email,
                  business: sup.name,
                  name:userInfo.HusbandName +" ו"+ userInfo.WifeName ,
                  phone:userInfo.Phone,
                  date:userInfo.Date,
                //hall: userInfo.CurrentWed.hall.contract.contractName === undefined ? "" : userInfo.CurrentWed.hall.contract.contractName,
                  invites:userInfo.Guest,
                  budget:lastRG
                }).then(function(response) { 
                    visibleNotification()
                    }, function(err){
                           console.log("FAILED. error=", err);
                    });
            })
          })
        }
        function genericMail(sup){
          
          auth.onAuthStateChanged((user) => {
            dataBase.ref('users/' + user.uid ).once('value').then(function (snapshotor) {
               userInfo =  snapshotor.val()
                  emailjs.send("wisewed_support", "wisewed_generic", {
                  supplier_email: sup.email,
                  business: sup.name,
                  name:userInfo.HusbandName +" ו"+ userInfo.WifeName ,
                  phone:userInfo.Phone,
                  date:userInfo.Date,
                //hall: userInfo.CurrentWed.hall.contract.contractName === undefined ? "" : userInfo.CurrentWed.hall.contract.contractName,
                  invites:userInfo.Guest,
                  budget:lastRG
                }).then(function(response) { 
                    visibleNotification()
                    }, function(err){
                           console.log("FAILED. error=", err);
                    });
            })
          })
        }
        function silverMail(sup){
          
          auth.onAuthStateChanged((user) => {
            dataBase.ref('users/' + user.uid ).once('value').then(function (snapshotor) {
               userInfo =  snapshotor.val()
                  emailjs.send("wisewed_support", "wisewed_silver", {
                  supplier_email: sup.email,
                  business: sup.name,
                  name:userInfo.HusbandName +" ו"+ userInfo.WifeName ,
                  phone:userInfo.Phone,
                  date:userInfo.Date,
                //hall: userInfo.CurrentWed.hall.contract.contractName === undefined ? "" : userInfo.CurrentWed.hall.contract.contractName,
                  invites:userInfo.Guest,
                  budget:lastRG
                }).then(function(response) { 
                    visibleNotification()
                    }, function(err){
                           console.log("FAILED. error=", err);
                    });
            })
          })
        }

        function visibleNotification(){
            $("#submit-all-supp").addClass("mail-loader-end")
            setTimeout(() => {
                $("#mail-send-update").addClass("mail-send-update-visible")
            }, 2500);
           
        }
      let userInfo = ""
    
    }