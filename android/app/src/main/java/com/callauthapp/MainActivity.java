package com.callauthapp;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.role.RoleManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.telecom.TelecomManager;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {

    private static final String[] REQUIRED_PERMISSIONS = {
            Manifest.permission.READ_PHONE_STATE,
            Manifest.permission.ANSWER_PHONE_CALLS,
            Manifest.permission.READ_CALL_LOG
    };

    private final ActivityResultLauncher<Intent> roleLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(),
                    result -> {
                        if (result.getResultCode() == RESULT_OK) {
                            Toast.makeText(this, "App configurado como filtro de chamadas!", Toast.LENGTH_LONG).show();
                            verificarStatus();
                        } else {
                            Toast.makeText(this, "Permissão de filtro de chamadas negada!", Toast.LENGTH_LONG).show();
                        }
                    });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        findViewById(R.id.btn_configurar).setOnClickListener(v -> {
            if (temPermissoes()) {
                solicitarRoleCallScreening();
            } else {
                solicitarPermissoes();
            }
        });

        verificarStatus();
    }

    private boolean temPermissoes() {
        for (String permission : REQUIRED_PERMISSIONS) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    private void solicitarPermissoes() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            requestPermissions(REQUIRED_PERMISSIONS, 100);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 100) {
            if (temPermissoes()) {
                solicitarRoleCallScreening();
            } else {
                Toast.makeText(this, "Permissões necessárias não concedidas!", Toast.LENGTH_LONG).show();
            }
        }
    }

    private void solicitarRoleCallScreening() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            RoleManager roleManager = (RoleManager) getSystemService(ROLE_SERVICE);
            if (roleManager != null && !roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
                Intent intent = roleManager.createRequestRoleIntent(RoleManager.ROLE_CALL_SCREENING);
                roleLauncher.launch(intent);
            } else {
                Toast.makeText(this, "App já é o filtro de chamadas padrão!", Toast.LENGTH_SHORT).show();
            }
        } else {
            Toast.makeText(this, "Recurso não suportado nesta versão do Android", Toast.LENGTH_SHORT).show();
        }
    }

    private void verificarStatus() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            RoleManager roleManager = (RoleManager) getSystemService(ROLE_SERVICE);
            if (roleManager != null && roleManager.isRoleHeld(RoleManager.ROLE_CALL_SCREENING)) {
                Toast.makeText(this, "✓ App configurado como filtro de chamadas", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(this, "⚠ Configure o app como filtro de chamadas", Toast.LENGTH_LONG).show();
            }
        }
    }
}