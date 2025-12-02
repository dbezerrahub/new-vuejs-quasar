package com.callauthapp;

import android.os.Bundle;
import android.telecom.Call;
import android.telecom.CallScreeningService;
import android.util.Log;

public class CallBlockerService extends CallScreeningService {
    private static final String TAG = "CallBlockerService";

    @Override
    public void onScreenCall(Call.Details callDetails) {
        if (callDetails == null || callDetails.getHandle() == null) {
            Log.e(TAG, "Detalhes da chamada ou handle são nulos");
            return;
        }

        String incomingNumber = callDetails.getHandle().getSchemeSpecificPart();
        Log.d(TAG, "Chamada recebida: " + incomingNumber);

        // Verifica se é um número para bloquear
        if (incomingNumber != null && incomingNumber.equals("081986320423")) {
            CallResponse response = new CallResponse.Builder()
                    .setDisallowCall(true)
                    .setRejectCall(true)
                    .setSkipNotification(true)
                    .setSkipCallLog(false)
                    .build();

            respondToCall(callDetails, response);
            Log.d(TAG, "Chamada bloqueada: " + incomingNumber);
        } else {
            // Permite a chamada normal
            CallResponse response = new CallResponse.Builder()
                    .setDisallowCall(false)
                    .setRejectCall(false)
                    .setSkipNotification(false)
                    .build();

            respondToCall(callDetails, response);
            Log.d(TAG, "Chamada permitida: " + incomingNumber);
        }
    }
}