import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-12">
      <Helmet>
        <title>Política de Privacidade - CarsaiPlay</title>
        <meta name="description" content="Leia a Política de Privacidade da plataforma CarsaiPlay." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="glass-effect rounded-xl p-8">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">Política de Privacidade</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p>Sua privacidade é importante para nós. É política do CarsaiPlay respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site CarsaiPlay, e outros sites que possuímos e operamos.</p>
            
            <h2 className="text-2xl font-bold text-white mt-8">Coleta de Informações</h2>
            <p>Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.</p>
            
            <p>Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.</p>
            
            <h2 className="text-2xl font-bold text-white mt-8">Uso de Informações</h2>
            <p>As informações que coletamos são usadas para:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Operar e manter nosso serviço</li>
              <li>Melhorar, personalizar e expandir nosso serviço</li>
              <li>Entender e analisar como você usa nosso serviço</li>
              <li>Desenvolver novos produtos, serviços, recursos e funcionalidades</li>
              <li>Comunicar com você, diretamente ou através de um de nossos parceiros</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-white mt-8">Cookies</h2>
            <p>Usamos cookies para melhorar sua experiência. Ao acessar o CarsaiPlay, você concorda em usar os cookies necessários. Um cookie é um arquivo de texto que é colocado no seu disco rígido por um servidor de página da web. Os cookies não podem ser usados ​​para executar programas ou enviar vírus para o seu computador. Os cookies são atribuídos exclusivamente a você e só podem ser lidos por um servidor da web no domínio que emitiu o cookie para você.</p>
            
            <h2 className="text-2xl font-bold text-white mt-8">Links para Outros Sites</h2>
            <p>Nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.</p>
            
            <h2 className="text-2xl font-bold text-white mt-8">Alterações na Política de Privacidade</h2>
            <p>Podemos atualizar nossa Política de Privacidade de tempos em tempos. Aconselhamos que você revise esta página periodicamente para quaisquer alterações. Iremos notificá-lo de quaisquer alterações, publicando a nova Política de Privacidade nesta página.</p>
            
            <p className="mt-8">Última atualização: 20 de junho de 2025</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;