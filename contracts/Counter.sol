pragma solidity ^0.4.25;

contract Counter {
  uint counter;
  uint storeddata;


  constructor() public {
    counter = 0; // Initialise the counter to 0
  }

  function increment() public {
    counter++;
  }

  function getCounter() public view returns (uint) {
    return counter;
  }



  function set(uint x) public {
  storeddata = x;
  }

  function get() public view returns(uint){
  return storeddata;
  }

 // Mapping UID with address 
    mapping(string => address) ownerMapping;
    

    function registerOwner(string uid,address owner) public {
      // require(msg.sender == owner)
        ownerMapping[uid] = owner;
    }
    
    function getUidOwner(string uid)public view returns(address Owner){
        return ownerMapping[uid];
    }

}
