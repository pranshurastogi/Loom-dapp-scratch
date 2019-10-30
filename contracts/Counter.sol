pragma solidity ^0.4.25;

contract Counter {
  uint counter;

  constructor() public {
    counter = 0; // Initialise the counter to 0
  }

  function increment() public {
    counter++;
  }

  function getCounter() public view returns (uint) {
    return counter;
  }


 // Mapping UID with address 
    mapping(string => address) ownerMapping;
    

    function registerOwner(string uid,address owner) public {
        ownerMapping[uid] = owner;
    }
    
    function getUidOwner(string uid)public view returns(address Owner){
        return ownerMapping[uid];
    }

}
