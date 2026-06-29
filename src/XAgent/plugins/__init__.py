"""Plugins package

This package contains all plugin implementations for XAgent.
Each plugin is a module with a plugin.py file that defines a plugin class.

Plugin Types:
- delivery: Message delivery plugins (email, webhook)
- filter: Data filtering plugins (dedup, rename, scale)
- north: North-bound communication plugins (mqtt_client, xnc_client)
- rule: Rule engine plugins (expression, threshold)
- south: South-bound device plugins (bacnet, knx, modbus)
"""

ALL_PLUGINS = [
    'XAgent.plugins.delivery.action.plugin',
    'XAgent.plugins.delivery.email.plugin',
    'XAgent.plugins.delivery.system.plugin',
    'XAgent.plugins.delivery.webhook.plugin',
    'XAgent.plugins.filter.dedup.plugin',
    'XAgent.plugins.filter.rename.plugin',
    'XAgent.plugins.filter.scale.plugin',
    'XAgent.plugins.north.mqtt_client.plugin',
    'XAgent.plugins.north.xnc_client.plugin',
    'XAgent.plugins.rule.expression.plugin',
    'XAgent.plugins.rule.schedule.plugin',
    'XAgent.plugins.rule.threshold.plugin',
    'XAgent.plugins.south.bacnet.plugin',
    'XAgent.plugins.south.knx.plugin',
    'XAgent.plugins.south.modbus.rtu.plugin',
    'XAgent.plugins.south.modbus.tcp.plugin',
]

__all__ = ['ALL_PLUGINS']
