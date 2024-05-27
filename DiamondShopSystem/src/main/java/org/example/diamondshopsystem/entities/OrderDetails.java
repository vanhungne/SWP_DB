package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.diamondshopsystem.entities.key.KeyOrderDetail;

@Entity
@Table(name = "[order_details]")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class OrderDetails {



    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private double price;

    @Column(name = "size")
    private double size;

    @EmbeddedId
    private KeyOrderDetail id;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    private Order order;


    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Products product;

}
