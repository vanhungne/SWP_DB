package org.example.diamondshopsystem.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.diamondshopsystem.entities.key.KeyFeedBack;

@Entity
@Table(name = "feedback")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class FeedBack {

   @EmbeddedId
   private KeyFeedBack key;

    @Column(name = "Rating")
    private int rating;

    @Column(name = "Comment")
    private String comment;


    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("userId")
    @JoinColumn(name = "customer_id")
    private User user;


    @ManyToOne(cascade = CascadeType.ALL)
    @MapsId("orderId")
    @JoinColumn(name = "order_id")
    private Order order;
}
