// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title WeatherOracle
 * @notice Custom on-chain oracle for Weather / IoT off-chain data.
 *         Only a trusted oracle node (off-chain service) can push data.
 */
contract WeatherOracle {
    // ── State ──────────────────────────────────────────────────────────────
    address public owner;
    address public oracleNode;          // the off-chain service wallet

    struct WeatherData {
        string  location;
        int256  temperatureCelsius;     // scaled x100  (e.g. 2350 = 23.50°C)
        uint256 humidity;               // percentage 0-100
        uint256 windSpeedKmh;
        string  condition;              // "Sunny", "Rainy", etc.
        uint256 timestamp;
    }

    WeatherData public latestWeather;

    // IoT sensor readings (keyed by sensor ID)
    struct IoTReading {
        string  sensorId;
        int256  value;                  // generic scaled value
        string  unit;
        uint256 timestamp;
    }
    mapping(string => IoTReading) public iotReadings;
    string[] public sensorIds;

    // ── Events ─────────────────────────────────────────────────────────────
    event WeatherUpdated(
        string location,
        int256 temperatureCelsius,
        uint256 humidity,
        uint256 windSpeedKmh,
        string condition,
        uint256 timestamp
    );

    event IoTUpdated(
        string sensorId,
        int256 value,
        string unit,
        uint256 timestamp
    );

    event OracleNodeChanged(address indexed oldNode, address indexed newNode);

    // ── Modifiers ──────────────────────────────────────────────────────────
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleNode, "Not authorized oracle");
        _;
    }

    // ── Constructor ────────────────────────────────────────────────────────
    constructor(address _oracleNode) {
        owner = msg.sender;
        oracleNode = _oracleNode;
    }

    // ── Owner functions ────────────────────────────────────────────────────
    function setOracleNode(address _newNode) external onlyOwner {
        emit OracleNodeChanged(oracleNode, _newNode);
        oracleNode = _newNode;
    }

    // ── Oracle push functions ──────────────────────────────────────────────

    /// @notice Push latest weather data on-chain (called by off-chain oracle)
    function updateWeather(
        string  calldata _location,
        int256  _temperatureCelsius,
        uint256 _humidity,
        uint256 _windSpeedKmh,
        string  calldata _condition
    ) external onlyOracle {
        latestWeather = WeatherData({
            location          : _location,
            temperatureCelsius: _temperatureCelsius,
            humidity          : _humidity,
            windSpeedKmh      : _windSpeedKmh,
            condition         : _condition,
            timestamp         : block.timestamp
        });

        emit WeatherUpdated(
            _location, _temperatureCelsius,
            _humidity, _windSpeedKmh, _condition,
            block.timestamp
        );
    }

    /// @notice Push an IoT sensor reading on-chain
    function updateIoT(
        string  calldata _sensorId,
        int256  _value,
        string  calldata _unit
    ) external onlyOracle {
        if (iotReadings[_sensorId].timestamp == 0) {
            sensorIds.push(_sensorId);
        }
        iotReadings[_sensorId] = IoTReading({
            sensorId : _sensorId,
            value    : _value,
            unit     : _unit,
            timestamp: block.timestamp
        });

        emit IoTUpdated(_sensorId, _value, _unit, block.timestamp);
    }

    // ── View helpers ───────────────────────────────────────────────────────
    function getLatestWeather() external view returns (WeatherData memory) {
        return latestWeather;
    }

    function getIoTReading(string calldata _sensorId)
        external view returns (IoTReading memory)
    {
        return iotReadings[_sensorId];
    }

    function getSensorCount() external view returns (uint256) {
        return sensorIds.length;
    }
}
