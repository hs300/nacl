/*!
 * Copyright(c) Graphene 2017 <pbft@foxmail.com>
 */

const naclFactory = require('js-nacl')
const nacl = {}

naclFactory.instantiate((naclInstance) => {
  nacl.makeKeypair = (hash) => {
    const keyPair = naclInstance.crypto_sign_keypair_from_seed(hash)
    return {
      publicKey: Buffer.from(keyPair.signPk),
      privateKey: Buffer.from(keyPair.signSk),
    }
  }

  nacl.sign = (hash, keyPair) => {
    const signature = naclInstance.crypto_sign_detached(hash, Buffer.from(keyPair.privateKey, 'hex'))
    return Buffer.from(signature)
  }

  nacl.verify = (hash, signature, publicKey) => {
    return naclInstance.crypto_sign_verify_detached(Buffer.from(signature, 'hex'),
      hash, Buffer.from(publicKey, 'hex'))
  }
})

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
