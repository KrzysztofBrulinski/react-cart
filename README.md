# Zadania

Zadania mogą być wykonane niezależnie, możesz użyć dowolnej biblioteki zewnętrznej. W miarę możliwości użyj Hook API.

* Rozszerz komponent App, aby lista produktów była pobierana z końcówki **/api/cart**, wyświetl nazwę produktu oraz jego cenę. Cena powinna być poprawnie sformatowana.
* Dodaj nowy komponent, który będzie wyświetlał liczbę sztuk produktu dodanych do koszyka. 

    * Komponent powinien wyświetlać dwa przyciski: plus i minus oraz tekst: "Obecnie masz X sztuk produktu".
    * Komponent będzie mógł przyjmować opcjonalne propsy min, max i isBlocked. Min i max mają określać minimalną i maksymalną liczbę sztuk.
    * Kliknięcia w plus i minus mają odpowiednio zwiększać i zmniejszać o 1 liczbę sztuk wyświetlaną w tekście w przedziale min i max.
    * Gdy wartość propsa isBlocked będzie true, przyciski zmiany ilości mają być zablokowane.

* Do powyższego komponentu dodaj sprawdzanie, czy wprowadzona liczba sztuk jest poprawna, w tym celu odpytaj końcówkę **/api/product/check**. W przypadku błędu liczba sztuk produktu powinna zostać wyzerowana do wartości minimalnej. Jeżeli to możliwe, dodaj funkcję debounce, aby zminimalizować liczbę zapytań.

* Do komponentu App dodaj zliczanie całkowitej sumy zamówienia. Suma powinna być wyświetlana pod listą produktów.

# Wymagania

Node wersja 12.x lub wyższa

# Uruchomienie

Instalacja zależności:

``` npm i ```


Uruchomienie projektu:

``` npm start ```

# API

W ramach projektu dostępne jest rest API:

## **GET** /api/cart

Zwraca zawartość koszyka.

### Odpowiedź

JSON z listą obiektów z polami:

* **pid** - identyfikator produktu
* **name** - nazwa produktu
* **price** - cena produktu
* **max** - maksymalna liczba sztuk produktu jaka może być dodana do koszyka
* **min** - minimalna liczba sztuk produktu jaka może być dodana do koszyka
* **isBlocked** - określa, czy można zmienić liczbę sztuk produktu dodanych do koszyka


Przykład zwracanych danych:
```
[
    {
        "pid": "8e5e1248-c799-4937-9acc-2b3ab0e034ff",
        "name": "Patelnia",
        "price": "89.99",
        "max": 10,
        "min": 1,
        
    }
]
```

## **POST** /api/product/check

Sprawdza, czy wprowadzona liczba sztuk produktu jest poprawna

### Zapytanie

Obiekt JSON z polami:

* **pid** - identyfikator sprawdzanego produktu
* **quantity** - wprowadzona liczba sztuk produktu

Przykład:

```
{
    "pid": "51630312-2166-4cae-9590-ad77fd9f4a55",
    "quantity": 1
}
```

### Odpowiedź

Obiekt JSON z polami:

* **isError** - określa czy wystąpił błąd
* **success** - określa czy wprowadzone dane są poprawne
* **message** - wiadomość (w przypadku wystąpienia błędu)
* **errorType** - typ błędu (INCORRECT_BODY, INCORRECT_TYPE, MISSING_PROPERTY, NOT_FOUND, INCORRECT_QUANTITY)

Przykład:

```
{
    "isError": true,
    "success": false,
    "message": "Product not found",
    "errorType": "NOT_FOUND"
}
```

