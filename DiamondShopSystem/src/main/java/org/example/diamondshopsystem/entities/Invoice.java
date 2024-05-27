package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Data
@Entity
@Table(name = "invoice")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private int invoiceId;

    @Column(name = "invoice_date")
    private Date invoiceDate;

    @Column(name = "invoice_due_date")
    private Date invoiceDueDate;

    @Column(name = "invoice_total_amount")
    private int totalAmount;

    @Column(name = "paid_amount")
    private double paidAmount;

    @ManyToOne(cascade = {CascadeType.DETACH,CascadeType.MERGE,CascadeType.PERSIST,CascadeType.REFRESH})
    @JoinColumn(name = "order_id")
    private Order order;

}
