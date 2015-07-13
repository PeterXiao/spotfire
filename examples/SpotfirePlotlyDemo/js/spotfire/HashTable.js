//
// Copyright (c) 2007 Spotfire AB,
// Första Långgatan 26, SE-413 28 Göteborg, Sweden.
// All rights reserved.
//
// This software is the confidential and proprietary information
// of Spotfire AB ("Confidential Information"). You shall not
// disclose such Confidential Information and shall use it only
// in accordance with the terms of the license agreement you
// entered into with Spotfire.
//


// JScript File
var HashTable = function ()
{
    /// <summary>Dictionary class for storing infomation in a logicale way.</summary>
};

HashTable.prototype.remove = function (key)
{
    /// <summary>Removes the value with given key.</summary>
    /// <param name="key" type="string">The key to the value to remove</param>
    this[key] = null;
};

HashTable.prototype.add = function (key, value)
{
    /// <summary>Adds the given value with the given key to the dictionary.</summary>
    /// <param name="key" type="string">The key to the value to add.</param>
    /// <param name="value" type="string">The value to add.</param>
    this[key] = value;
};

HashTable.prototype.lookup = function (key)
{
    /// <summary>Get the value with given key.</summary>
    /// <param name="key" type="string">The key to the value to get.</param>
    /// <returns type="object">The value, null if key not found.</returns>
    return this[key];
};

HashTable.prototype.containsKey = function (key)
{
    /// <summary>Check if a given key exists in the hash table.</summary>
    /// <param name="key" type="string">The key to check.</param>
    /// <returns type="bool">True if the key exists, false otherwise.</returns>
    return this[key] != null;
};