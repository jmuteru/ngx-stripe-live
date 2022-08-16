import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

import { NgxStripeModule } from 'ngx-stripe';

import { AppComponent } from './app.component';
import { DialogComponent } from './dialog.component';

import { PLUTO_ID } from './pluto.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatToolbarModule,
    NgxStripeModule.forRoot(
      'pk_test_51Ii5RpH2XTJohkGafOSn3aoFFDjfCE4G9jmW48Byd8OS0u2707YHusT5PojHOwWAys9HbvNylw7qDk0KkMZomdG600TJYNYj20'
    ),
  ],
  providers: [
    // Ignore everything related to PLUTO, this is just to retrieve a payment intent
    {
      provide: PLUTO_ID,
      useValue: '449f8516-791a-49ab-a09d-50f79a0678b6',
    },
  ],
  declarations: [AppComponent, DialogComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
