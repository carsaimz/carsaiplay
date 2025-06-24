import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const TermsOfService = () => {
  return (
    <div className="min-h-screen py-12">
      <Helmet>
        <title>Termos de Uso - CarsaiPlay</title>
        <meta name="description" content="Leia os Termos de Uso da plataforma CarsaiPlay." />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="glass-effect rounded-xl p-8">
          <h1 className="text-4xl font-bold gradient-text mb-8 text-center">Termos de Uso</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p>Bem-vindo ao CarsaiPlay! Estes termos e condições descrevem as regras e regulamentos para o uso do site CarsaiPlay, localizado em [URL do seu site].</p>
            
            <p>Ao acessar este site, presumimos que você aceita estes termos e condições. Não continue a usar o CarsaiPlay se não concordar com todos os termos e condições declarados nesta página.</p>
            
            <h2 className="text-2xl font-bold text-white mt-8">Licença</h2>
            <p>Salvo indicação em contrário, o CarsaiPlay e/ou seus licenciadores detêm os direitos de propriedade intelectual de todo o material no CarsaiPlay. Todos os direitos de propriedade intelectual são reservados. Você pode acessar isso no CarsaiPlay para seu uso pessoal, sujeito às restrições estabelecidas nestes termos e condições.</p>
            <p>Você não deve:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Republicar material do CarsaiPlay</li>
              <li>Vender, alugar ou sub-licenciar material do CarsaiPlay</li>
              <li>Reproduzir, duplicar ou copiar material do CarsaiPlay</li>
              <li>Redistribuir conteúdo do CarsaiPlay</li>
            </ul>
            
            <h2 className="text-2xl font-bold text-white mt-8">Conteúdo do Usuário</h2>
            <p>Nosso Serviço permite que você poste, vincule, armazene, compartilhe e, de outra forma, disponibilize certas informações, textos, gráficos, vídeos ou outros materiais. Você é responsável pelo Conteúdo que posta no Serviço, incluindo sua legalidade, confiabilidade e adequação.</p>
            
            <h2 className="text-2xl font-bold text-white mt-8">Isenção de Responsabilidade</h2>
            <p>O CarsaiPlay não hospeda nenhum vídeo em seus servidores. Todo o conteúdo é fornecido por terceiros não afiliados. O CarsaiPlay atua apenas como um indexador de conteúdo encontrado publicamente na internet. Nós não nos responsabilizamos pelo conteúdo hospedado em sites de terceiros e não temos controle sobre ele.</p>
            
            <h2 className="text-2xl font-bold text-white mt-8">Alterações nos Termos</h2>
            <p>Reservamo-nos o direito, a nosso exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso exclusivo critério.</p>
            
            <p className="mt-8">Última atualização: 20 de junho de 2025</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;