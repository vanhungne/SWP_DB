package org.example.diamondshopsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor


public class InvoiceDTO {

    private int invoiceId;

    private Date invoiceDate;

    private Date invoiceDueDate;

    private int totalAmount;

    private double paidAmount;
}
