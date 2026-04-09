<?php

namespace App\Services;

use App\Helpers\AddressHelper;
use App\Models\Invoice;
use Spatie\LaravelPdf\Enums\Format;

use function Spatie\LaravelPdf\Support\pdf;

class InvoiceExportService
{
  public function __construct(protected Invoice $invoice)
  {
  }

  public function pdf()
  {
    $this->invoice->load('items.artwork', 'contact');
    $galleryLogo = $this->invoice->gallery->logo()->base64Content();
    $gallery = $this->invoice->gallery;
    $gallery->formatted_address_two_line = AddressHelper::formatAddress($gallery->address, 2);
    $this->invoice->contact->formatted_address_two_line = AddressHelper::formatAddress($this->invoice->contact->address, 2);

    $pdf = pdf()
      ->view('Invoices/invoice', [
        'invoice' => $this->invoice,
        'gallery' => $gallery,
      ])
      ->headerView('Invoices/invoice-header', ['invoice' => $this->invoice, 'gallery' => $gallery, 'galleryLogo' => $galleryLogo])
      ->footerView('Invoices/invoice-footer', ['gallery' => $gallery])
      ->margins(3.5, 0, 1, 0, 'in')
      ->format(Format::Letter)
      ->portrait();

    return $pdf;
  }
}
