package com.callauthapp;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.app.role.RoleManager;
import android.content.Intent;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_CALL_SCREENING_ROLE = 5001;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        pedirPermissaoCallScreening();
    }

    private void pedirPermissaoCallScreening() {
        RoleManager roleManager = (RoleManager) getSystemService(ROLE_SERVICE);

        if (!roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
            Intent intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING);
            startActivityForResult(intent, REQUEST_CALL_SCREENING_ROLE);
        }
    }
}
