package org.example.diamondshopsystem.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;


@Entity
@Table(name = "discountCodes")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class DiscountCodes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_id")
    private int codeId;

    @Column(name = "code")
    private String code;

    @Column(name = "discount_percenttage")
    private int discountPercentTage;

    @Column(name = "code_quantity")
    private int codeQuantity;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "promotion_id")
    private Promotions promotion;

    @OneToMany(
            mappedBy = "discountCode", fetch = FetchType.LAZY,
            cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH}
    )
    private List<Order> orderList;


}
