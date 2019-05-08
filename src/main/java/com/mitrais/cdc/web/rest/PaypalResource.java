package com.mitrais.cdc.web.rest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mitrais.cdc.config.PaypalClient;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@CrossOrigin
@RequestMapping(value = "/api")
public class PaypalResource {

    private final PaypalClient paypalClient;
    
    @Autowired
    PaypalResource(PaypalClient paypalClient){
        this.paypalClient = paypalClient;
    }

    @PostMapping(value = "/paypal/make/payment")
    public Map<String, Object> makePayment(@RequestParam("sum") String sum, @RequestParam("currentOrigin") String currentOrigin, 
    		@RequestParam("returnUrl") String returnUrl){
        return paypalClient.createPayment(sum, currentOrigin, returnUrl);
    }

    @PostMapping(value = "/paypal/complete/payment")
    public Map<String, Object> completePayment(HttpServletRequest request, @RequestParam("paymentId") String paymentId, @RequestParam("payerId") String payerId){
        return paypalClient.completePayment(request);
    }


}
