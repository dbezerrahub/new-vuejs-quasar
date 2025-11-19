package com.callauthapp;

import android.telecom.Call;
import android.telecom.CallScreeningService;

public class CallBlockerService extends CallScreeningService {

    @Override
    public void onScreenCall(Call.Details details) {

        String incomingNumber = details.getHandle().getSchemeSpecificPart();

        if (incomingNumber.equals("+5511999999999")) {  // número a bloquear
            CallResponse response = new CallResponse.Builder()
                    .setDisallowCall(true)        // bloqueia
                    .setRejectCall(true)          // rejeita na hora
                    .setSkipNotification(true)    // não exibe notificação
                    .build();

            respondToCall(details, response);
            return;
        }

        // Se não é o número bloqueado → permite
        respondToCall(details, new CallResponse.Builder().build());
    }
}