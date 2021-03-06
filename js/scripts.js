let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("add a Pokemon!");
    }
  }

  function getAll() {
    return pokemonList;
  }

  function addListItem(pokemonList  ) {
    pokemonRepository.loadDetails(pokemonList).then(function (){
      let $row = $(".row");
      let $card = $('<div class="card"></div>');
      let $image = $('<img class="card-img-top" alt="card image" />');
      $image.attr("src", pokemonList.imageUrl);
      let $cardBody = $('<div class="card-body"></div>');
      let $cardTitle = $("<h4 class='card-title' >" + pokemonList.name + "</h4>");
      let $seeMore = $(
        '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokemonModal">See more</button>'
      );

      $row.append($card);
      $card.append($image);
      $card.append($cardBody);
      $cardBody.append($cardTitle);
      $cardBody.append($seeMore);
      $seeMore.on("click", function (event){
        showDetails(pokemon);
      });
    });
  }

  function showDetails(item) {
    pokemonRepository.loadDetails(item).then(function () {
      showModal(item);
    });
  }

  function loadList() {
    return $.ajax(apiUrl)
      .then(function (json) {
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (e) {
        console.error();
      });
  }

    function loadDetails(item) {
      let url = item.detailsUrl;
      return $.ajax(url)
        .then(function (details) {
          // Now we add the details to the item
          item.imageUrl = details.sprites.front_default;
          item.height = details.height;
          item.abilities = [];
          details.abilities.forEach(function (pokemonType) {
            item.abilities.push(pokemonType.ability.name);
          });
          item.types = [];
          details.types.forEach(function (pokemonType) {
            item.types.push(pokemonType.type.name);
          })
        .catch(function (e) {
          console.error(e);
        });
    })

    function showModal (pokemonList) {
      let modalBody = $(".modal-body");
      let modalTitle = $(".modal-title");
      let modalHeader = $(".modal-header");
      modalTitle.empty();
      modalBody.empty();

      let pokemonName = $("<h1>" + pokemonList.name + "</h1>");
      let pokemonImage = $('<img class="modal-img" style="width:50%">');
      pokemonImage.attr("src", pokemonList.imageUrl);
      let pokemonHeight = $("<p>" + "Height :  " +  pokemonList.height + "</p>");
      let pokemonType = $("<p>" + "Types :  " + pokemonList.types + "</p>");
      let pokemonAbilities = $("<p>" + "Abilities :  " + pokemonList.abilities + "</p>")

      modalTitel.append(pokemonName);
      modalBody.append(pokemonImage);
      modalBody.append(pokemonHeight);
      modalBody.append(pokemonType);
      modalBody.append(pokemonAbilities);
    }

    return {
      add: add,
      getAll: getAll,
      addListItem: addListItem,
      loadList: loadList,
      loadDetails: loadDetails,
      showDetails: showDetails,
    };
};

  pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
      pokemonRepository.addListItem(pokemon);
    });
  });
