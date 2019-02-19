/*!
 * Copyright(c) Graphene 2017 <pbft@foxmail.com>
 */

const twnacl = require('tweetnacl')

const nacl = {
  makeKeypair (hash) {
    const keyPair = twnacl.sign.keyPair.fromSeed(hash)
    return {
      publicKey: Buffer.from(keyPair.publicKey),
      privateKey: Buffer.from(keyPair.secretKey),
    }
  },
  sign (hash, keyPair) {
    const signature = twnacl.sign.detached(hash, Buffer.from(keyPair.privateKey, 'hex'))
    return Buffer.from(signature)
  },
  verify (hash, signature, publicKey) {
    return twnacl.sign.detached.verify(hash, Buffer.from(signature, 'hex'), Buffer.from(publicKey, 'hex'))
  }
}

try {
  var Thread = require('hydra')
  Thread.isFactory = true
} catch (e) {
  Thread = undefined
  logger.warn('hydra load failed, use js-nacl instead')
}

if (Thread) {
  module.exports = Thread
} else {
  module.exports = nacl
}
