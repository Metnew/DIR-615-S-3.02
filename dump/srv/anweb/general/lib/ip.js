!(function() {
  function parse(ip, isSubnet) {
    var result = ipv4Pattern.exec(ip);
    return result
      ? result[2]
        ? { ip: result[1], mask: bitsetToIp(getMaskByLength(+result[2])) }
        : { ip: ip, mask: bitsetToIp(getMaskByIp(ip, isSubnet)) }
      : null;
  }
  function isMask(ip) {
    var binIp = getBinaryIp(ip);
    return !(~binIp & -binIp);
  }
  function isValidMaskForSubnet(subnet, mask) {
    return !(~getBinaryIp(mask) & getBinaryIp(subnet));
  }
  function isIpFromSubnet(subnet, mask, ip) {
    var binSubnet = getBinaryIp(subnet),
      binMask = getBinaryIp(mask),
      binIp = getBinaryIp(ip);
    return !((binSubnet ^ binIp) & binMask);
  }
  function getNextIp(ip) {
    return bitsetToIp(getBinaryIp(ip) + 1);
  }
  function getMaskLength(mask) {
    return isMask(mask) ? getMaskLengthByLowBit(getBinaryIp(mask)) : null;
  }
  function isIPv4(ip) {
    return ipv4Pattern.test(ip);
  }
  function isIPv6(ip) {
    return ipv6Pattern.test(ip);
  }
  function getMaskByIp(ip, isSubnet) {
    return getMaskByLength(getMaskLengthByIp(ip, isSubnet));
  }
  function getMaskByLength(length) {
    return length ? -1 << (32 - length) : 0;
  }
  function getMaskLengthByIp(ip, isSubnet) {
    var binIp = getBinaryIp(ip),
      highOctet = binIp >>> 24;
    if (!isSubnet) {
      if (isInRange(highOctet, 0, 128)) return 8;
      if (isInRange(highOctet, 128, 192)) return 16;
      if (isInRange(highOctet, 192, 224)) return 24;
    }
    return isClassfulSubnet(binIp, 'A')
      ? 8
      : isClassfulSubnet(binIp, 'B')
        ? 16
        : isClassfulSubnet(binIp, 'C')
          ? 24
          : isInRange(highOctet, 0, 224)
            ? getMaskLengthByLowBit(binIp)
            : 0;
  }
  function getBinaryIp(ip) {
    function shiftOr(octet) {
      bitset = (bitset << 8) | octet;
    }
    var octets = ip.split('.').map(Number),
      bitset = 0;
    return octets.forEach(shiftOr), bitset;
  }
  function isClassfulSubnet(binSubnet, netClass) {
    var classRanges = {
        A: { start: 0, end: 128, maskLength: 8 },
        B: { start: 128, end: 192, maskLength: 16 },
        C: { start: 192, end: 224, maskLength: 24 },
      },
      highOctet = binSubnet >>> 24,
      curClass = classRanges[netClass];
    return (
      isInRange(highOctet, curClass.start, curClass.end) &&
      !(binSubnet << curClass.maskLength)
    );
  }
  function isInRange(num, start, end) {
    return num >= start && end > num;
  }
  function getMaskLengthByLowBit(subnetBitset) {
    var onlyLowBit = -subnetBitset & subnetBitset,
      pow = ~~(Math.log(onlyLowBit >>> 0) / Math.LN2);
    return 32 - pow;
  }
  function bitsetToIp(bitset) {
    for (var octets = [], fullOctet = 255, i = 0; 4 > i; i++)
      octets.unshift(bitset & fullOctet), (bitset >>>= 8);
    return octets.join('.');
  }
  var ipv4Pattern = /^((?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(?:\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
    ipv6Pattern = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
    IP = {
      parse: parse,
      isMask: isMask,
      isValidMaskForSubnet: isValidMaskForSubnet,
      isIpFromSubnet: isIpFromSubnet,
      getNextIp: getNextIp,
      getMaskLength: getMaskLength,
      isIPv4: isIPv4,
      isIPv6: isIPv6,
    };
  'undefined' != typeof module && 'undefined' != typeof module.exports
    ? (module.exports = IP)
    : (window.IP = IP);
})();
