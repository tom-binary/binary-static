pjax_config_page("new_account/japanws", function(){
  return {
    onLoad: function() {
      Content.populate();
      ValidAccountOpening.redirectCookie();
      if (page.client.residence !== 'jp') {
        window.location.href = page.url.url_for('trading');
        return;
      }
      handle_residence_state_ws();
      BinarySocket.send({get_settings:1});
      detect_hedging($('#trading-purpose'), $('.hedging-assets'));
      $('#japan-form').submit(function(evt) {
        evt.preventDefault();
        if (JapanAccOpeningUI.checkValidity()){
          BinarySocket.init({
            onmessage: function(msg){
              var response = JSON.parse(msg.data);
              if (response) {
                var type = response.msg_type;
                if (type === 'new_account_japan'){
                  ValidAccountOpening.handler(response, response.new_account_japan);
                } else if (type === 'sanity_check') {
                  ValidAccountOpening.handler(response);
                }
              }
            }
          });
          JapanAccOpeningUI.fireRequest();
        }
      });
    }
  };
});
