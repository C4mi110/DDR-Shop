// JavaScript source code
var koszyk = new Array();

function load_ddr1() {
    $(".subpages").load("subpages/ddr1.html");
}
function load_ddr2() {
    $(".subpages").load("subpages/ddr2.html");
}
function load_ddr3() {
    $(".subpages").load("subpages/ddr3.html");
}
function load_ddr4() {
    $(".subpages").load("subpages/ddr4.html");
}
function load_koszyk() {
    $(".subpages").load("load/koszyk.html");
}

function create_item_object() {
    $(document).ready(function () {
    $(".button").click(function () {
            var id = $(this).siblings("#span_id").text();
            var name = $(this).siblings("#name").text();
            var price = $(this).siblings("#price").text();
            var description = $(this).siblings("#description").text();
            var ilosc = parseInt($(this).siblings("#ilosc").val());
            if (!ilosc) {
                alert("Wypełnij ilość");
                return;
            }
            var item = { id: id, name: name, price: price, ilosc: ilosc, description: description };
            check_then_add_item(item);
        });
    });
}
function check_then_add_item(item) {
    if (koszyk.length === 0) {
        alert("Dodano produkt do koszyka.");
        koszyk.push(item);
    } else {
        for (var i = 0; i < koszyk.length; i++) {
            if (koszyk[i].id === item.id) {
                var choose_if_next = confirm("Podany produkt jest już w koszyku. Czy chcesz zwiększyć jego ilość?");
                if (choose_if_next) {
                    for (var i = 0; i < koszyk.length; i++) {
                        if (koszyk[i].id === item.id) {
                            koszyk[i].ilosc += item.ilosc;
                        }
                    }
                    return;
                    } else {
                    return;
                }
            }
        }
        koszyk.push(item);
        alert("Dodano produkt do koszyka.");
    }
}
function do_Cookie() {
      for (var i = 0; i < koszyk.length; i++) {
        koszyk[i] = JSON.stringify(koszyk[i]);
    }
      document.cookie = "koszyk=" + koszyk+ ",";
}
function show_Cookie() {
    alert(document.cookie);
}
function cookie_by_name() {
    var cookies = document.cookie.split("; ");
      for (var i = 0; i < cookies.length; i++) {
        var cookieName = cookies[i].split("=")[0];
        var cookieVal = cookies[i].split("=")[1];
        if (cookieName === 'koszyk')
            var display_Basket = decodeURI(cookieVal);
        var splitted_item = display_Basket.split("},");
        var total_price = 0;
        var products = "";
          for (var i = 0; i < splitted_item.length - 1; i++) {
            var item = splitted_item[i] + '}';
            var parsed = JSON.parse(item);
            var parsed_ilosc = parseInt(parsed.ilosc);
            var price = parseInt(parsed.price.substring(0, 3));
            var do_zaplaty = parsed_ilosc*price;
            var produkt = "<tr><td class='lalign'>" + parsed.name +
                "</td>" + "<td id='pri'>" + parsed.price +
                "</td>" + "<td>" + parsed.ilosc +
                "</td>" + "<td style='max-width: 200px;'>" + parsed.description +
                "</td>" + "<td>" + do_zaplaty + " zł" + "</td>" +
                "<td> <a onclick='delete_item("+parsed.id+")'> USUŃ </a> </td>" + "</tr>";

                $("tbody").append(produkt);
            var total_price = total_price + do_zaplaty;
            var send_product = "%0D%0A" + "Nazwa: " + parsed.name +
                "%0D%0A" + "Cena: " + parsed.price +
                "%0D%0A" + "Ilość: " + parsed.ilosc +
                "%0D%0A" + "Opis: " + parsed.description +
                "%0D%0A" + "%0D%0A";
            var products = products + send_product;
        }
        var total_price = total_price + " zł";
        var products ="Do zapłaty łącznie:" + total_price  + products;
        $("#total").text(" "+total_price);
    }
    $("button").attr("onclick", "");

    $("#send").click(function () {
        var username = prompt("Podaj imię i nazwisko:");
        if (username == null)
              return;
        var email = prompt("Podaj email:");
        if (email == null)
            return;
            alert("Wygenerowano link do mail'a");
              $("#wrapper").append("<a href='' id='email'>Wyślij e-mail</a>");
            $("#email").attr("href", "mailto:" + email + "?subject=Pan/i " + username + "zakupy w DDR 2K17 &body" + products);

    });
}
function delete_item(id) {
    var cookies = document.cookie.split("; ");
    for (var i = 0; i < cookies.length; i++) {
        var cookieName = cookies[i].split("=")[0];
          var cookieVal = cookies[i].split("=")[1];
        if (cookieName === 'koszyk')
            var display_Basket = decodeURI(cookieVal);
            var splitted_item = display_Basket.split("},");
        if (splitted_item.length === 2) {
            delete koszyk;
            document.cookie = "koszyk=";
              location.reload();
        }
        for (var i = 0; i < splitted_item.length - 1; i++) {
            var item = splitted_item[i] + '}';
            var parsed = JSON.parse(item);
            if (parsed.id == id) {
                  splitted_item[i]="";
            }
            if (splitted_item[i] !== "") {
                koszyk.push(splitted_item[i] + "}");
                document.cookie = "koszyk=" + koszyk + ",";
            }
        }

    }
    location.reload();
}
