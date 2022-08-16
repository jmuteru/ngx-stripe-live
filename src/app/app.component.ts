import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';

import { StripeElementsOptions, Appearance } from '@stripe/stripe-js';

import { StripePaymentElementComponent, StripeService } from 'ngx-stripe';

import { DialogComponent } from './dialog.component';
import { PlutoService } from './pluto.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  @ViewChild(StripePaymentElementComponent)
  paymentElement: StripePaymentElementComponent;

  checkoutForm = this.fb.group({
    name: ['Ricardo', [Validators.required]],
    email: ['support@ngx-stripe.dev', [Validators.required]],
    address: ['Av. Ramon Nieto 313B 2D', [Validators.required]],
    zipcode: ['36205', [Validators.required]],
    city: ['Vigo', [Validators.required]],
    amount: [2500, [Validators.required, Validators.pattern(/\d+/)]],
  });

  appearance: Appearance = {
    theme: 'stripe',
    labels: 'floating',
    variables: {
      colorPrimary: '#673ab7',
    },
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en',
  };

  paying = false;

  get amount() {
    if (
      !this.checkoutForm.get('amount') ||
      !this.checkoutForm.get('amount').value
    )
      return 0;
    const amount = this.checkoutForm.get('amount').value;
    return Number(amount) / 100;
  }

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private stripeService: StripeService,
    private plutoService: PlutoService
  ) {}

  ngOnInit() {
    this.plutoService
      .createPaymentIntent({
        amount: this.checkoutForm.get('amount').value,
        currency: 'eur',
      })
      .subscribe((pi) => {
        this.elementsOptions.clientSecret = pi.client_secret;
      });
  }

  collectPayment() {
    if (this.paying) return;
    if (this.checkoutForm.invalid) {
      return;
    }

    this.paying = true;
    this.stripeService
      .confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.checkoutForm.get('name').value,
              email: this.checkoutForm.get('email').value,
              address: {
                line1: this.checkoutForm.get('address').value,
                postal_code: this.checkoutForm.get('zipcode').value,
                city: this.checkoutForm.get('city').value,
              },
            },
          },
        },
        redirect: 'if_required',
      })
      .subscribe({
        next: (result) => {
          this.paying = false;
          if (result.error) {
            this.dialog.open(DialogComponent, {
              data: {
                type: 'error',
                message: result.error.message,
              },
            });
          } else if (result.paymentIntent.status === 'succeeded') {
            this.dialog.open(DialogComponent, {
              data: {
                type: 'success',
                message: 'Payment processed successfully',
              },
            });
          }
        },
        error: (err) => {
          this.paying = false;
          this.dialog.open(DialogComponent, {
            data: {
              type: 'error',
              message: err.message || 'Unknown Error',
            },
          });
        },
      });
  }

  clear() {
    this.checkoutForm.patchValue({
      name: '',
      email: '',
      address: '',
      zipcode: '',
      city: '',
    });
  }
}
