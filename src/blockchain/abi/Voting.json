
pragma solidity ^0.8.0;

contract Voting {
    address public owner;

    struct Candidate {
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public hasVoted;

    uint public candidatesCount;

    constructor() {
        owner = msg.sender;
        addCandidate("Alice");
        addCandidate("Bob");
    }

    modifier onlyOnce() {
        require(!hasVoted[msg.sender], "Already voted.");
        _;
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == owner, "Only owner can add.");
        candidates[candidatesCount] = Candidate(_name, 0);
        candidatesCount++;
    }

    function vote(uint _candidateId) public onlyOnce {
        require(_candidateId < candidatesCount, "Invalid candidate.");
        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;
    }

    function getCandidate(uint _id) public view returns (string memory, uint) {
        Candidate memory c = candidates[_id];
        return (c.name, c.voteCount);
    }
}
